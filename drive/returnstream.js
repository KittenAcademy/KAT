
'use strict';

var google = require('googleapis');
var fs = require('fs');
var google = require('googleapis');
var auth = require('./driveauth.js');
var path = require('path');

var dir = './cache';

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

module.exports = function(fileId, callback) {
    auth(function(auth) {

        download(fileId, auth, callback)
            // console.log('download',auth);
    })
}

function download(fileId, auth, callback) {
    var drive = google.drive({
        version: 'v3',
        auth: auth
    });

    drive.files.get({
        fileId: fileId
    }, function(err, metadata) {
        if (err) {
            console.error(err);
            // return process.exit();
        }



        callback(drive.files.get({
                fileId: fileId,
                alt: 'media'
        })
            .on('error', function(err) {
                console.log('Error downloading file', err);
                // process.exit();
        }));
    });
}
