let s3 = require("../s3/s3.js");
let drivestream = require("../drive/returnstream.js");

module.exports.GetImageURL = function (imageid, extension, callback) {
	let filename = imageid + "." + extension;
	s3.fileUploaded(filename, function (isUploaded) {
		if (isUploaded) {
			callback(s3.getURL(filename));
		} else {
			let metatag;
			switch (extension) {
			case "png":
				metatag = "image/png";
				break;
			default:
				metatag = "image/jpeg";
				break;
			}
			drivestream(imageid, function (inputStream) {
				inputStream.pipe(s3.uploadFromStream(filename, metatag, function () { // function also sends back err and data 
					callback(s3.getURL(filename));
				}));
			});
		}
	});
};