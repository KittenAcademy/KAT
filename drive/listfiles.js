var google = require('googleapis');
var auth = require('./driveauth.js');
/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

//TODO: Cache the file list


module.exports = function(callback) {
    auth(function(auth) {
        // console.log('listfiles',auth);
        listFiles(auth, callback);
    })
}

function listFiles(auth, callback) {
    var service = google.drive('v3');
    service.files.list({
        auth: auth,
        q: "mimeType = 'image/gif' and '0BwoBPbVKwbI9TUdFSG0yRjh5UTQ' in parents",
        //https://developers.google.com/drive/v3/reference/files/list#try-it https://developers.google.com/drive/v3/web/search-parameters
        pageSize: 10,
        fields: "nextPageToken, files(id, name)"
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
            //   console.log('Files:');
            //   for (var i = 0; i < files.length; i++) {
            //     var file = files[i];
            //     console.log('%s (%s)', file.name, file.id);
            //   }
            callback(files);
        }
    });
}
