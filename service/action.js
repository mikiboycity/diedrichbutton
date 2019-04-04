'use strict';

/**
 * Action handler to be triggered when the end user will emit an event from his IoT enterprise button
 *
 * This will create a Salesforce case for the owner of button
 */
const SES = require('aws-sdk/clients/ses');
const ses = new SES({
  region: 'us-west-2',
  apiVersion: '2010-12-01'
});

module.exports.handler = async event => {
  console.log('event', JSON.stringify(event));

  var email = event.placementInfo.attributes.email;
  var dsn = event.placementInfo.attributes.dsn;

  var params = {
    Destination: {
      ToAddresses: [email]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `You have clicked a button: ${dsn}`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Button event'
      }
    },
    // Source: 'donotreply@diedrichroasters.com'
    Source: 'mr.andrey.g.f@gmail.com'
  };

  try {
    await ses.sendEmail(params).promise();
  } catch (error) {
    console.error(JSON.stringify(error));
    throw error;
  }

  console.log('Successfully, processed the event');
};
