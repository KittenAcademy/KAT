// const allgifs = require("./gifs.js"),
// 	gifs = require("../files/gifs.js");

// /**
//  * @param {{ (data: any): void; (file: any): void; }} callback
//  */
// const getlatest = callback => {
// 	allgifs(
// 		/**
// 		 * @param {{ id: any; name: any; }[]} filelist
// 		 */
// 		filelist => {
// 			filesFound(filelist[0], callback);
// 		});
// };

// /**
//  * @param {{ id: any; name: any; }} file
//  * @param {(arg0: { path: any; name: any; }) => void} callback
//  */
// function filesFound(file, callback) {
// 	gifs.GetGifURL(file.id, /**
// 		 * @param {any} fileurl
// 		 */
// 		function (fileurl) {
// 			callback({ path: fileurl, name: file.name });
// 		});
// }

// module.exports = getlatest;