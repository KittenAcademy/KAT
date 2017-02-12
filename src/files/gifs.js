let s3 = require("../s3/s3.js");
let drivestream = require("../drive/returnstream.js");

module.exports.GetGifURL = function (gifid, callback) {
	let filename = gifid + ".gif";
	s3.fileUploaded(filename, function (isUploaded) {
		if (isUploaded) {
			callback(s3.getURL(filename));
		} else {
			drivestream(gifid, function (inputStream) {
				inputStream.pipe(s3.uploadFromStream(filename, "image/gif", function () { // err, data
					callback(s3.getURL(filename));
				}));
			});
		}
	});
};