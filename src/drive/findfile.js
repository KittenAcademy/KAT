// "use strict";
// let allgifs = require("./gifs.js");
// let allimages = require("./images.js");
const gifs = require("../files/gifs.js"),
	cloudFront = require("../cloudFront/cloudFront.js"),
	databaseDal = require("../database");
// let images = require("../files/images.js");

/**
 * @param {any} stringToFind
 * @param {any} filelist
 */
function matchString(stringToFind, filelist) {
	const filtered = new Array();
	let filteredTags = filterXwhereYhasZ(filelist, "tags", stringToFind);
	let filteredNames = filterXwhereYhasZ(filelist, "name", stringToFind);

	// filtered.concat(filteredNames, filteredTags);
	Array.prototype.push.apply(filtered, filteredNames);
	Array.prototype.push.apply(filtered, filteredTags);
	return filtered;
}

/**
 * @param {string} stringToFind
 */
module.exports = async (stringToFind) => {
	let file = {};
	if (stringToFind.indexOf(' ') >= 0) {
		file = await databaseDal.FindGifByTags(stringToFind.split(" "));
	} else {
		file = await databaseDal.SearchForGif(stringToFind);
	}
	if (!file) return null;
	file.path = cloudFront.getURL(file.id) + ".gif";
	return file;
};

/**
 * @param {any[]} arr
 * @param {string} prop
 */
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


/**
 * @param {any[] | { name: string; id: string; }[]} files
 * @param {{ (data: any): void; (arg0: any): void; (arg0: { path: any; name: any; }): void; (arg0: { path: any; name: any; }): void; }} callback
 * @param {boolean} getone
 */
function filesFound(files, callback, getone) {
	if (!getone) {
		callback(files);
		return;
	}
	let file = getRandomFile(files);
	const fileurl = gifs.GetGifURL(file.id);
	callback({ path: fileurl, name: file.name });
}

/**
 * @param {{ filter: (arg0: (xa: any) => any) => void; }} x
 * @param {string} y
 * @param {string} z
 */
function filterXwhereYhasZ(x, y, z) {
	z = z.toLowerCase();
	return x.filter(
		/**
		 * @param {{ [x: string]: { indexOf: (arg0: any) => number; }; }} xa
		 */
		function (xa) {
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

/**
 * @param {any[]} filelist
 */
function getRandomFile(filelist) {
	return filelist[Math.floor(Math.random() * (filelist.length))];
}
