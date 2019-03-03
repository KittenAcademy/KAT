let auth = require("./driveauth.js");
let helpers = require("./helpers");

/**
 * @param {{ (arg0: any): void; (arg0: any): void; }} callback
 */
module.exports = callback => {
	const cache = GetCache();
	if (cache) {
		callback(cache);
		return;
	}
	auth(
		function (auth) {
			// console.log('listfiles',auth);
			helpers.listFiles("mimeType = 'image/gif' and '0BwoBPbVKwbI9TUdFSG0yRjh5UTQ' in parents", auth,
				/**
				 * @param {any} files
				 */
				function (files) {
					AddCache(files);
					callback(files);
				});
		});
};

const Cache = {};

function GetCache() {
	if (Cache.expires > new Date().getTime()) {
		return Cache.value;
	}
	else {
		return null;
	}
}

/**
 * @param {any} value
 */
function AddCache(value) {
	Cache.value = value;
	Cache.expires = new Date().addMinutes(9999).getTime();
	// console.log(value);
	// console.log(Cache);
}

Date.prototype.addMinutes = function (m) {
	this.setMinutes(this.getMinutes() + m);
	return this;
};