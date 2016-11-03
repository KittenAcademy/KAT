var listfiles = require('./listfiles.js');
var download = require('./download.js');

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
