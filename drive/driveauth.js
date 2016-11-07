//https://console.developers.google.com/apis/credentials/consent?project=beaming-team-148423
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-nodejs-quickstart.json

//TODO: this needs to work through a web page as the console will not be available for input when hosted

var SCOPES = [
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.photos.readonly',
  'https://www.googleapis.com/auth/drive.readonly'
];


var TOKEN_DIR = './';
var TOKEN_PATH = TOKEN_DIR + 'drivetoken.json';

//TODO: Cache the auth token

module.exports = function(callback) {
  var cache = GetCache();
  if (cache){
    callback(cache);
    return;
  }
    BeginAuth(callback);
}

function BeginAuth(callback){
    // Load client secrets from a local file.
    fs.readFile('cache/client_secret.json', function processClientSecrets(err, content) {
      if (err) {
        if (process.env.ClientSecret) {
          content = process.env.ClientSecret;
        } else {
          console.log('Error loading client secret file', err)
          callback({success: false, message: 'Error loading client secret file: ' + err});
          return;
        }
      }
      // Authorize a client with the loaded credentials, then call the
      // Drive API.
      authorize(JSON.parse(content), function(auth){
        //   console.log('driveauth',auth);
          callback(auth);
      });
    });
}


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err || Object.keys(token).length === 0) {
      console.log('err when reading token', err, TOKEN_PATH);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
      AddCache(oauth2Client);
    }
  });
}


var Cache = new Object();

function GetCache(){
    if (Cache.expires > new Date().getTime()){
        return Cache.value;
    } else {
  console.log('no token in cache')
        return null;
    }
}

function AddCache(value){
  console.log('adding token to cache', value)
    Cache.value = value;
    Cache.expires = new Date().addHours(1).getTime();
}

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}