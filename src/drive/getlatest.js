"use strict";
let allgifs = require("./gifs.js");
let gifs = require("../files/gifs.js");


let getlatest = function (callback) {
	allgifs(function (filelist) {
		filesFound(filelist[0], callback);
	});
};

function filesFound(file, callback) {
	gifs.GetGifURL(file.id, function (fileurl) {
		callback({ path: fileurl, name: file.name });
	});
}

module.exports = getlatest;

getlatest(function (data) {
	console.log("latest", data);
});