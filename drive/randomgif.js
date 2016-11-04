var listfiles = require('./listfiles.js');
var download = require('./download.js');

var UpcomingFiles = new Array();

function GetFiles(){
    listfiles(function(files) {
        var fileNumber = random(files.length);
        var fileid = files[fileNumber].id;
        var upcomingFile = '/gifs/'+fileid+'.gif';
        if (UpcomingFiles.indexOf(upcomingFile) > -1) { //don't add a dupe to the upcoming list
            GetFiles();
            return;
        } 
        download(fileid, function(file) {
            if (UpcomingFiles.length < 3) {
                GetFiles();
            } else {
                UpcomingFiles.splice(0,1);
            }
            UpcomingFiles.push(upcomingFile);
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
