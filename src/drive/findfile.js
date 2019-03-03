"use strict";
let allgifs = require("./gifs.js");
// let allimages = require("./images.js");
let gifs = require("../files/gifs.js");
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
 * @param {string} stringsToFind
 * @param {{ (file: { name: string; path: string; }): void; (file: { name: any; path: string; }): void; (filename: any): void; (files: any): void; (arg0: any): void; }} callback
 * @param {boolean} [getone]
 * @param {string} [search]
 */
module.exports = (stringsToFind, callback, getone, search) => {
	if (getone === undefined) getone = true;
	if (search === undefined) search = "gif";
	let filelist;
	switch (search) {
		// case "image": {
		// 	filelist = allimages;
		// 	break;
		// }
		default: {
			filelist = allgifs;
			break;
		}
	}
	filelist(/**
		 * @param {any} filelist
		 */
		function (filelist) {
			let filtered = new Array();
			const stringsToFindsplit = stringsToFind.split(" ");
			if (stringsToFindsplit.length > 0) {
				for (let i = 0; i < stringsToFindsplit.length; i++) {
					const stringToFind = stringsToFindsplit[i];
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
	let extention = file.name.split(".").pop();
	if (extention == "gif") {
		gifs.GetGifURL(file.id, /**
			 * @param {any} fileurl
			 */
			function (fileurl) {
				callback({ path: fileurl, name: file.name });
			});
	// } else {
	// 	images.GetImageURL(file.id, extention, /**
	// 		 * @param {any} fileurl
	// 		 */
	// 		function (fileurl) {
	// 			callback({ path: fileurl, name: file.name });
	// 		});
	}
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
