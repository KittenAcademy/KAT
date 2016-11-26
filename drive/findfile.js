'use strict';
var listfiles = require('./listfiles.js');
var download = require('./download.js');

module.exports = function(stringToFind, callback, getone){
    if (!getone) getone = false;
    listfiles(function (filelist){
        var filtered = filterXwhereYhasZ(filelist, 'tags', stringToFind)
        if (filtered.length > 0){
            filesFound(filtered, callback, getone);
            return;
        }
        filtered = filterXwhereYhasZ(filelist, 'name', stringToFind)
        if (filtered.length > 0){
            filesFound(filtered, callback, getone);
            return;
        }
        callback(null);
    });
}

function filesFound(files, callback, getone){
    if (!getone) {
        callback(files);
        return;
    }
    var file = getRandomFile(files);
    download(file.id, function(downloadedID) {
        callback({path:'/gifs/'+file.id+'.gif',name:file.name});
    });
}

function filterXwhereYhasZ(x, y, z) {
    return x.filter(function (xa) {
        if (xa[y] !== undefined)
        if (Array.isArray(xa[y])){
            if (xa[y].indexOf(z) > -1) { 
                return xa;
             }
        } else {
            if (xa[y].indexOf(z) > -1) { 
                return xa; 
            }
        } 
    });
}

function getRandomFile(filelist) {
  return filelist[Math.floor(Math.random() * (filelist.length))];
}