'use strict';
var listfiles = require('./listfiles.js');
var download = require('./download.js');

module.exports = function(stringToFind, callback, getone) {
    if (getone === undefined) getone = true;
    listfiles(function(filelist) {
        var filteredTags = filterXwhereYhasZ(filelist, 'tags', stringToFind);
        var filteredNames = filterXwhereYhasZ(filelist, 'name', stringToFind);
        
        var filtered = new Array();
        // filtered.concat(filteredNames, filteredTags);
        Array.prototype.push.apply(filtered, filteredNames);
        Array.prototype.push.apply(filtered, filteredTags);

        if (filtered.length > 0) {
            filesFound(removeDuplicates(filtered, 'id'), callback, getone);
            return;
        }
        callback(null);
    });
}

function removeDuplicates(arr, prop) {
     var new_arr = [];
     var lookup  = {};
 
     for (var i in arr) {
         lookup[arr[i][prop]] = arr[i];
     }
 
     for (i in lookup) {
         new_arr.push(lookup[i]);
     }
 
     return new_arr;
 }
 

function filesFound(files, callback, getone) {
    if (!getone) {
        callback(files);
        return;
    }
    var file = getRandomFile(files);
    download(file.id, function(downloadedID) {
        callback({
            path: '/gifs/' + file.id + '.gif',
            name: file.name
        });
    });
}

function filterXwhereYhasZ(x, y, z) {
    z = z.toLowerCase();
    return x.filter(function(xa) {
        if (xa[y] !== undefined)
            if (Array.isArray(xa[y])) {
                if (xa[y].indexOf(z) > -1) {
                    return xa;
                }
            }
            else {
                if (xa[y].indexOf(z) > -1) {
                    return xa;
                }
            }
    });
}

function getRandomFile(filelist) {
    return filelist[Math.floor(Math.random() * (filelist.length))];
}
