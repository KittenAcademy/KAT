var google = require('googleapis');
var auth = require('./driveauth.js');
/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */



module.exports = function(callback) {
    auth(function(auth) {
        // console.log('listfiles',auth);
        listFiles(auth, callback);
    })
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
    Cache.expires = new Date().addHours(1).getTime();
}

function listFiles(auth, callback) {
    var cache = GetCache();
    // if (cache) {
    //     callback(cache);
    //     return;
    // }
    var service = google.drive('v3');
    service.files.list({
        auth: auth,
        q: "mimeType = 'image/gif' and '0BwoBPbVKwbI9TUdFSG0yRjh5UTQ' in parents",
        //https://developers.google.com/drive/v3/reference/files/list#try-it https://developers.google.com/drive/v3/web/search-parameters
        pageSize: 1000,
        fields: "nextPageToken, files(id, name, description)"
    }, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        var files = response.files;
        if (files.length == 0) {
            console.log('No files found.');
        }
        else {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                file.name = file.name.toLowerCase();
                if (!file.description) continue;
                //file.tags = file.description.ToLower().split('#');
                file.tags = file.description.split("#").map(function(item) {
                    return item.trim().toLowerCase();
                });
            }
            //   console.log('Files:');
            //   for (var i = 0; i < files.length; i++) {
            //     var file = files[i];
            //     console.log('%s (%s)', file.name, file.id);
            //   }
            callback(files);
            AddCache(files);
        }
    });
}

Date.prototype.addHours = function(h) {
    this.setHours(this.getHours() + h);
    return this;
}
