var AWS = require("aws-sdk");
var setting = require("../settings.js");
var s3 = new AWS.S3({
	apiVersion: "2006-03-01", 
	credentials: new AWS.Credentials(
		setting("AWS_ACCESS_KEY_ID"), 
		setting("AWS_SECRET_ACCESS_KEY")
	)
});
var stream = require("stream");
var URL = require("url");
var S3_BUCKET = setting("S3_BUCKET");

module.exports.fileUploaded = function (key, callback) {
	var KEY = key;
	var params = { Bucket: S3_BUCKET, Key: KEY };
	s3.headObject(params, function (err, data) { //4332406
		if (err){
			switch (err.code) {
			case "NotFound":
				callback(false);
				return;
			default:
				throw (err);
			}
			
		}
		if (data.ContentLength < 1000) {
			callback(false);
		}
		else {
			callback(true);
		}
	});
};

module.exports.getURL = function(key){
	var KEY = key;
	var params = { Bucket: S3_BUCKET, Key: KEY };
	var url = URL.parse(s3.getSignedUrl("getObject", params));
	url.search = null;
	return URL.format(url);
};

module.exports.uploadFromStream = function (key, type, callback) {
	var KEY = key;
	var pass = new stream.PassThrough();

	var params = { Bucket: S3_BUCKET, Key: KEY, Body: pass, ContentType: type, StorageClass: "REDUCED_REDUNDANCY", CacheControl: "max-age=31536000" };
	s3.upload(params, function (err, data) {
		callback(err, data);
	});

	return pass;
};