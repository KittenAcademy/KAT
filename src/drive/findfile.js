"use strict";
let allgifs = require("./gifs.js");
let allimages = require("./images.js");
let gifs = require("../files/gifs.js");
let images = require("../files/images.js");

function matchString(stringToFind, filelist) {
	let filtered = new Array();
	let filteredTags = filterXwhereYhasZ(filelist, "tags", stringToFind);
	let filteredNames = filterXwhereYhasZ(filelist, "name", stringToFind);

	// filtered.concat(filteredNames, filteredTags);
	Array.prototype.push.apply(filtered, filteredNames);
	Array.prototype.push.apply(filtered, filteredTags);
	return filtered;
}

let findFile = function (stringsToFind, callback, getone, search) {
	if (getone === undefined) getone = true;
	if (search === undefined) search = "gif";
	let filelist;
	switch (search) {
	case "image": {
		filelist = allimages;
		break;
	}
	default: {
		filelist = allgifs;
		break;
	}
	}
	filelist(function (filelist) {
		let filtered = new Array();
		let stringsToFindsplit = stringsToFind.split(" ");
		if (stringsToFindsplit.length > 0) {
			for (let i = 0; i < stringsToFindsplit.length; i++) {
				let stringToFind = stringsToFindsplit[i];
				let arraytouse;
				if (filtered.length == 0) {
					arraytouse = filelist;
				} else {
					arraytouse = filtered;
				}
				let itemsFound = matchString(stringToFind, arraytouse);
				if (itemsFound.length > 0) {
					filtered = new Array();
				}
				Array.prototype.push.apply(filtered, itemsFound);
			}
		}
		else {
			Array.prototype.push.apply(filtered, matchString(stringsToFind, filelist));
		}
		// console.log(filtered, stringsToFind)
		if (filtered.length > 0) {
			filesFound(removeDuplicates(filtered, "id"), callback, getone);
			return;
		}
		callback(null);
	});
};

function removeDuplicates(arr, prop) {
	let new_arr = [];
	let lookup = {};

	for (let i in arr) {
		lookup[arr[i][prop]] = arr[i];
	}

	for (let i in lookup) {
		new_arr.push(lookup[i]);
	}

	return new_arr;
}


function filesFound(files, callback, getone) {
	if (!getone) {
		callback(files);
		return;
	}
	let file = getRandomFile(files);
	let extention = file.name.split(".").pop();
	if (extention == "gif") {
		gifs.GetGifURL(file.id, function (fileurl) {
			callback({ path: fileurl, name: file.name });
		});
	} else {
		images.GetImageURL(file.id, extention, function (fileurl) {
			callback({ path: fileurl, name: file.name });
		});
	}
}

function filterXwhereYhasZ(x, y, z) {
	z = z.toLowerCase();
	return x.filter(function (xa) {
		if (xa[y] !== undefined) {
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
		}
	});
}

function getRandomFile(filelist) {
	return filelist[Math.floor(Math.random() * (filelist.length))];
}

module.exports = findFile;

filesFound([{ name: "testgif.gif", id: "0BwoBPbVKwbI9QlRYVmRsbVhscGs" }], function (data) {
	console.log(data);
}, true);

// findFile("ivy", function(data){
//	 console.log("ivy", "image", data);
// }, true, "image");
// findFile("ivy", function(data){
//	 console.log("ivy", "gif", data);
// }, true, "gif");
// findFile("harv", function(data){
//	 console.log("harv", "image", data);
// }, true, "image");
// findFile("harv", function(data){
//	 console.log("harv", "gif", data);
// }, true, "gif");
// findFile("league_faculty_harvey_custard_custaru_hug_attack", function(data){
//	 console.log("league_faculty_harvey_custard_custaru_hug_attack", "gif", data);
// }, true, "gif");
