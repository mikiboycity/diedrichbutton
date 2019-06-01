'use strict';

/**
 * Action handler to be triggered when the end user will emit an event from his IoT enterprise button
 *
 * This will create a Salesforce case for the owner of button
 */

var jwtflow = require('new-salesforce-jwt');
var jsforce = require('jsforce');
var privateKey = require('fs').readFileSync('../key/salesforce.key', 'utf8');

// function reBuildPrivateKey() {
//   var beginPk = '-----BEGIN PRIVATE KEY-----\n';
//   var endPk = '\n-----END PRIVATE KEY-----\n';
//   resulturn (
//     beginPk +
//     process.env.privateKey
//       .split(' ')
//       .concat()
//       .join('\n') +
//     endPk
//   );
// }

module.exports.handler = (event, context, callback) => {
  console.log('event', JSON.stringify(event));

  // 1. Extract necessary info from event
  var email = event.placementInfo.attributes.email;
  var username = event.placementInfo.attributes.username;
  var dsn = event.placementInfo.attributes.dsn;
  var opportunityId = event.placementInfo.attributes.opportunity_id;
  var contactId = event.placementInfo.attributes.contact_id;

  console.log(`Event owner info => email: ${email}, DSN: ${dsn}, username: ${username}, opportunity_id: ${opportunityId}, contact_id: ${contactId}`);

  // 2. Authenticate with Salesforce
  var CONSUMER_KEY = process.env.SF_CONSUMER_KEY;
  var USERNAME = process.env.SF_USERNAME;
  var INSTANCE_URL = process.env.SF_INSTANCE_URL;
  var sandbox = process.env.isSandbox == 'true'; //Set to true, if publishing PE to a sandbox org

  jwtflow.getToken(CONSUMER_KEY, privateKey, USERNAME, sandbox, function(err, accessToken) {
    if (err) {
      console.err('Error for getting OAuth token:', err);
      callback(err, null); // Error in JWT Flow
    }

    // 3. Initialize a connection to Salesforce instance
    if (accessToken) {
      var sfConnection = new jsforce.Connection();
      sfConnection.initialize({
        instanceUrl: INSTANCE_URL,
        accessToken: accessToken
      });

      if (sfConnection) {
        // 4. Create a case in Salesforce
        console.log('The Salesforce connection has been built successfully');

        const params = {
          AccountId: username,
          Status: 'New',
          Origin: 'IoT button',
          Subject: `New IoT button case for DSN number ${dsn}`,
          // Description: 'This case has been issued from Diedrich button',
          Reason: 'New problem',
          ContactId: contactId,
          Opportunity__c: opportunityId
        };
        sfConnection.sobject('Case').create(params, function(err, result) {
          if (err || !result.success) {
            console.error(err, result);
            callback(err, null);
            return;
          }

          console.log('Created the case with id : ' + result.id);
          callback(null, result.id);
        });
      }
    }
  });
};
