// let auth = require("./driveauth.js");
// const helpers = require("./helpers");

// module.exports = /**
//  * @param {{ (arg0: any): void; (arg0: any): void; }} callback
//  */
//  function(callback) {
// 	let cache = GetCache();
// 	if (cache) {
// 		callback(cache);
// 		return;
// 	}
// 	auth(/**
// 		 * @param {any} auth
// 		 */
// function(auth) {
// 		// console.log('listfiles',auth);
// 		helpers.listFiles("(mimeType = 'image/png' or mimeType = 'image/jpeg')and '0BwoBPbVKwbI9TUdFSG0yRjh5UTQ' in parents", auth, /**
// 			 * @param {any} files
// 			 */
//  function(files){

// 			callback(files);
// 			AddCache(files);
// 		});
// 	});
// };

// let Cache = {};

// function GetCache() {
// 	if (Cache.expires > new Date().getTime()) {
// 		return Cache.value;
// 	}
// 	else {
// 		return null;
// 	}
// }

// /**
//  * @param {any} value
//  */
// function AddCache(value) {
// 	Cache.value = value;
// 	Cache.expires = new Date().addMinutes(10).getTime();
// }


// Date.prototype.addMinutes = function(m) {
// 	this.setMinutes(this.getMinutes() + m);
// 	return this;
// };