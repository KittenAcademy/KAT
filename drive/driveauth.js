//https://console.developers.google.com/apis/credentials/consent?project=beaming-team-148423
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var database = require('../database.js');
var path = require('path');
var setting = require('../settings.js')

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-nodejs-quickstart.json

//TODO: this needs to work through a web page as the console will not be available for input when hosted

var SCOPES = [
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.photos.readonly',
  'https://www.googleapis.com/auth/drive.readonly'
];


// var TOKEN_DIR = './cache';
// var TOKEN_PATH =  path.join(__dirname, '..', 'cache', 'drivetoken.json'); //TOKEN_DIR + 'drivetoken.json';

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
    authorize(setting('ClientSecret'), function(auth){
      //   console.log('driveauth',auth);
        callback(auth);
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
  database.GetCache('drivetoken', function(err, token) {
    if (err || Object.keys(token).length === 0) {
      console.log('err when reading token', err, 'drivetoken');
    } else {
      oauth2Client.credentials = token;
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