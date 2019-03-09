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
const findFile = async (stringToFind) => {
	let file = {};
	let files = [];
	if (stringToFind.indexOf(' ') >= 0) {
		files = await databaseDal.FindGifByTags(stringToFind.toLowerCase().split(" "));
	} else {
		files = await databaseDal.SearchForGif(stringToFind.toLowerCase());
	}
	// console.log(stringToFind,"files raw", files)
	// console.log(stringToFind,"files results", files[0].results)
	if (files.length < 1) return null;
	file = files[0].results[Math.floor(Math.random()*files[0].results.length)];;
	file.path = cloudFront.getURL(file.id) + ".gif";
	// console.log(stringToFind, "file", file)
	return file;
};

// findFile("Cooper space cat")
// findFile("MR DaNcE")
// findFile("MRa DaNcE")
// findFile("MR a DANcE")
// findFile("MR a makes wave DAaNcE")
module.exports = findFile;

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
