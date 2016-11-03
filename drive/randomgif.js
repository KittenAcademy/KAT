var listfiles = require('./listfiles.js');
var download = require('./download.js');

//TODO: Run persistantly so everyone gets the same gif at the same time

module.exports = function(callback) {
    listfiles(function(files) {
        var fileNumber = random(files.length);
        download(files[fileNumber].id, function(file) {
            callback(file);
        });
    });
}

function random(count) {
    return Math.floor(Math.random() * count);
}
