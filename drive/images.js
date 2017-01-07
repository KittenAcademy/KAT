var auth = require('./driveauth.js');
var helpers = require('./helpers');
/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */



module.exports = function(callback) {
    var cache = GetCache();
    if (cache) {
        callback(cache);
        return;
    }
    auth(function(auth) {
        // console.log('listfiles',auth);
        helpers.listFiles("(mimeType = 'image/png' or mimeType = 'image/jpeg')and '0BwoBPbVKwbI9TUdFSG0yRjh5UTQ' in parents", auth, function(files){

            callback(files);
            AddCache(files);
        });
    });
}

var Cache = new Object();

function GetCache() {
    if (Cache.expires > new Date().getTime()) {
        return Cache.value;
    }
    else {
        return null;
    }
}

function AddCache(value) {
    Cache.value = value;
    Cache.expires = new Date().addMinutes(10).getTime();
}


Date.prototype.addMinutes = function(m) {
    this.setMinutes(this.getMinutes() + m);
    return this;
}
