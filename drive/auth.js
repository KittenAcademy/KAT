//https://console.developers.google.com/apis/credentials/consent?project=beaming-team-148423
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

var SCOPES = [
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.photos.readonly',
  'https://www.googleapis.com/auth/drive.readonly'
];


var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
  process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';

//TODO: Cache the auth token

function GetOauth2Client(callback) {
  fs.readFile('drive/client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      if (process.env.ClientSecret) {
        content = process.env.ClientSecret;
      } else {
        callback({success: false, message: 'Error loading client secret file: ' + err});
        return;
      }
    }
    // Authorize a client with the loaded credentials, then call the
    // Drive API.
    var credentials = JSON.parse(content);
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
      callback({success: true, message: oauth2Client});
  });
}

module.exports.GetAuthURL = function(callback) {
  GetOauth2Client(function(oauth2Clientret){
    if (!oauth2Clientret.success) {
      callback(oauth2Clientret);
      return;
    }
    var oauth2Client = oauth2Clientret.message;
    var authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    });
    callback({success: true, message: authUrl});
  });
};

module.exports.UseCode = function(code, callback) {
  GetOauth2Client(function(oauth2Clientret){
    if (!oauth2Clientret.success) {
      callback(oauth2Clientret);
      return;
    }
    var oauth2Client = oauth2Clientret.message;
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        callback({success: false, message: err});
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token, callback);
    });
  });
}

function storeToken(token, callback) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  }
  catch (err) {
    if (err.code != 'EEXIST') {
      callback({success: false, message: err});
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  
      callback({success: true, message: 'Token stored to ' + TOKEN_PATH});
}
