'use strict';
var listfiles = require('./listfiles.js');
var download = require('./download.js');

function matchString(stringToFind, filelist){
    var filtered = new Array();
    var filteredTags = filterXwhereYhasZ(filelist, 'tags', stringToFind);
    var filteredNames = filterXwhereYhasZ(filelist, 'name', stringToFind);
    
    // filtered.concat(filteredNames, filteredTags);
    Array.prototype.push.apply(filtered, filteredNames);
    Array.prototype.push.apply(filtered, filteredTags);
    return filtered;
}

var FindFile = function(stringsToFind, callback, getone) {
    if (getone === undefined) getone = true;
    listfiles(function(filelist) {
        var filtered = new Array();
        var stringsToFindsplit = stringsToFind.split(" ");
        if (stringsToFindsplit.length > 0){
            for (var i = 0; i < stringsToFindsplit.length; i++) {
                var stringToFind = stringsToFindsplit[i];
                var arraytouse;
                if (filtered.length == 0) {
                    arraytouse = filelist
                } else {
                    arraytouse = filtered
                }
                var itemsFound = matchString(stringToFind, arraytouse);
                if (itemsFound.length > 0) {
                    var filtered = new Array();
                }
                Array.prototype.push.apply(filtered, itemsFound);
            }
        }
        else {
            Array.prototype.push.apply(filtered, matchString(stringsToFind, filelist));
        }
        // console.log(filtered, stringsToFind)
        if (filtered.length > 0) {
            filesFound(removeDuplicates(filtered, 'id'), callback, getone);
            return;
        }
        callback(null);
    });
}

module.exports = FindFile

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


// FindFile('harv tetetetete', function(data){
//     console.log("data",'harv tetetetete', data);
// })
// FindFile('harv goofy', function(data){
//     console.log("data",'harv goofy', data);
// })
// FindFile('harv pounce', function(data){
//     console.log("data",'harv pounce', data);
// })
// FindFile('harv', function(data){
//     console.log("data",'harv', data);
// })