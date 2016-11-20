'use strict';
var listfiles = require('./listfiles.js');

module.exports = function(stringToFind, callback){
    listfiles(function (filelist){
        var filtered = filterXwhereYhasZ(filelist, 'tags', stringToFind)
        if (filtered.length > 0){
        callback('/gifs/'+getRandomFile(filtered).id+'.gif');
            return;
        }
        filtered = filterXwhereYhasZ(filelist, 'name', stringToFind)
        callback('/gifs/'+getRandomFile(filtered).id+'.gif');
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