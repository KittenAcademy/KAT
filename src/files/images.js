var s3 = require("../s3/s3.js");
var drivestream = require("../drive/returnstream.js");

module.exports.GetImageURL = function (imageid, extension, callback) {
	var filename = imageid + "." + extension;
	s3.fileUploaded(filename, function (isUploaded) {
		if (isUploaded) {
			callback(s3.getURL(filename));
		} else {
			var metatag;
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