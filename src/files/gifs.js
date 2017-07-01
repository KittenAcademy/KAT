let s3 = require("../s3/s3.js");

module.exports.GetGifURL = function (gifid, callback) {
	let filename = gifid + ".gif";
	s3.fileUploaded(filename, function (isUploaded) {
		if (isUploaded) {
			callback(s3.getURL(filename));
		} else {
			new (require("../drive/returnstream.js"))(gifid, function (inputStream) {
				inputStream.pipe(s3.uploadFromStream(filename, "image/gif", function () { // err, data
					callback(s3.getURL(filename));
				}));
			});
		}
	});
};

module.exports.FixGif = function (gifid, callback) {
	let filename = gifid;
	if(gifid.indexOf(".gif") == -1) {
		filename = filename + ".gif";
	} else {
		gifid = gifid.replace(".gif", "");
	}
	s3.deleteFile(filename, function (success) {
		if (!success) {
			callback("failed");
			return;
		}
		new (require("../drive/returnstream.js"))(gifid, function (inputStream) {
			inputStream.pipe(s3.uploadFromStream(filename, "image/gif", function () { // err, data
				callback(s3.getURL(filename));
			}));
		});
	});
};