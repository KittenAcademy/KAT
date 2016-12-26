// Copyright 2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
            // .pipe(res);
        // res.oldWriteHead = res.writeHead;
        // res.writeHead = function(statusCode, reasonPhrase, headers) {
        //     res.header('Cache-Control', 'max-age=86400, public');
        //     res.header('Content-Disposition', 'inline; filename="KA_' + fileId + '.gif"');

        //     res.oldWriteHead(statusCode, reasonPhrase, headers);
        // }
        // res
        //     .on('finish', function() {
        //         //console.log('Downloaded %s!', metadata.name);
        //         // process.exit();
        //     })
        //     .on('error', function(err) {
        //         console.log('Error writing file', err);
        //         // process.exit();
        //     });
    });
}
