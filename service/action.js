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
//   return (
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

  var email = event.placementInfo.attributes.email;
  var dsn = event.placementInfo.attributes.dsn;

  console.log(`Event owner info => email: ${email}, DSN: ${dsn}`);

  var CLIENT_ID = '3MVG92mNMNiWvongbgrUuIP.VC4NhWvjeyxFi2kdeI0Aqum_mBnlxRuM4opL7g.dQgAflnAtwTw48osXQ1YXB';
  var USERNAME = 'igor@puplab.digital';
  var LOGIN_URL = 'https://ap6.salesforce.com';
  var sandbox = process.env.isSandbox == 'true'; //Set to true, if publishing PE to a sandbox org

  //Get AccessToken using JWT OAuth2 flow
  jwtflow.getToken(CLIENT_ID, privateKey, USERNAME, sandbox, function(err, accessToken) {
    if (err) {
      console.err('Error for getting OAuth token:', err);
      callback(err, null); // Error in JWT Flow
    }

    //With the OAuth access token, connect to Salesforce
    if (accessToken) {
      var sfConnection = new jsforce.Connection();
      sfConnection.initialize({
        instanceUrl: LOGIN_URL,
        accessToken: accessToken
      });
      if (sfConnection) {
        // Create a case in Salesforce
        console.log('The Salesforce connection has been built successfully');
      }
    }
  });
};
