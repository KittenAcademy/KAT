var listfiles = require('./listfiles.js');
var download = require('./download.js');

var UpcomingFiles = new Array();

function GetFiles(){
    listfiles(function(files) {
        var fileNumber = random(files.length);
        var file = files[fileNumber];
        var filePath = '/gifs/'+file.id+'.gif';
        // if (UpcomingFiles.indexOf(upcomingFile) > -1) { //don't add a dupe to the upcoming list
        //     GetFiles();
        //     return;
        // } 
        download(file.id, function(downloadedID) {
            if (UpcomingFiles.length < 3) {
                GetFiles();
            } else {
                UpcomingFiles.splice(0,1);
            }
            UpcomingFiles.push({
                filePath: filePath,
                tags: file.tags,
                name: file.name
            });
        });
    });
}

function RunLoop(){
    setTimeout(function(){
        GetFiles();
        RunLoop();
    }, 10000);
}
RunLoop();

module.exports = function() {
    return UpcomingFiles;
}

function random(count) {
    return Math.floor(Math.random() * count);
}
