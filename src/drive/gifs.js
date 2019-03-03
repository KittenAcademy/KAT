// let driveauth = require("./driveauth.js");
// let dal = require("./dal");

// /**
//  * @param {{ (arg0: any): void; (arg0: any): void; }} callback
//  */
// module.exports = async callback => {
// 	const cache = GetCache();
// 	if (cache) {
// 		callback(cache);
// 		return;
// 	}
// 	// console.log('listfiles',auth);
// 	const files = await dal.listAllFiles();
// 	AddCache(files);
// 	callback(files);
// };

// const Cache = {};

// function GetCache() {
// 	return Cache.value;
// }

// /**
//  * @param {any} value
//  */
// function AddCache(value) {
// 	Cache.value = value;
// }
