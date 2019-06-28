'use strict';

const IoT1ClickProjects = require('aws-sdk/clients/iot1clickprojects');
const iot1clickProjects = new IoT1ClickProjects({
  apiVersion: '2018-05-14',
  region: 'us-west-2'
});

const IoT1ClickDevicesService = require('aws-sdk/clients/iot1clickdevicesservice');
const iot1clickDevicesService = new IoT1ClickDevicesService({
  apiVersion: '2018-05-14',
  region: 'us-west-2'
});

const uuid = require('uuid/v4');

module.exports.handler = async event => {
  console.log('event', JSON.stringify(event));

  // 1. Validate params
  if (!event.body) {
    console.error('Specify DSN, username, email, phone parameters');
    return {
      statusCode: 400,
      body: 'Specify DSN, username, email and phone parameters'
    };
  }

  const body = JSON.parse(event.body);

  const dsn = body.dsn;
  const username = body.username;
  const email = body.email;
  const phone = body.phone;
  const opportunity_id = body.opportunity_id;
  const contact_id = body.contact_id;

  console.log(`dsn: ${dsn}, username: ${username}, email: ${email}, phone: ${phone}`, `opportunity_id: ${opportunity_id}`, `contact_id: ${contact_id}`);

  if (typeof dsn !== 'string' || typeof username !== 'string' || typeof email !== 'string' || typeof phone !== 'string' || typeof opportunity_id !== 'string' || typeof contact_id !== 'string') {
    console.error('Specify DSN, username, email, phone, opportunity_id, and contact_id parameters');
    return {
      statusCode: 400,
      body: 'Specify DSN, username, email, phone, opportunity_id, and contact_id parameters'
    };
  }

  // 2. Create an empty placement in AWS IoT 1-Click's Diedrich project
  const placementName = uuid();
  const projectName = process.env.PROJECT_NAME;

  var params = {
    placementName,
    projectName,
    attributes: {
      dsn,
      username,
      email,
      phone,
      opportunity_id,
      contact_id
    }
  };

  try {
    await iot1clickProjects.createPlacement(params).promise();
    console.log('Created an empty placement with device attributes');
  } catch (error) {
    console.error('Creating placement error:', JSON.stringify(error));

    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }

  // 3. Associate the button to the placement
  const deviceTemplateName = process.env.DEVICE_TEMPLATE_NAME;

  params = {
    deviceId: dsn,
    deviceTemplateName,
    placementName,
    projectName
  };

  try {
    await iot1clickProjects.associateDeviceWithPlacement(params).promise();
    console.log('Successfully, associated a device to the placement');

    // 4. Enable device
    params = {
      DeviceId: dsn,
      Enabled: true
    };
    await iot1clickDevicesService.updateDeviceState(params).promise();
    console.log('Successfully, enabled a device');
  } catch (error) {
    console.error('error:', JSON.stringify(error));

    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }

  console.log('Successfully, registered a button in AWS IoT 1-Click');

  return {
    statusCode: 200,
    body: `Successfully registered a button: ${dsn} in AWS IoT 1-Click`
  };
};
