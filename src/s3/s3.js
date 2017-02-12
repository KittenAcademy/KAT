let AWS = require("aws-sdk");
let setting = require("../settings.js");
let s3 = new AWS.S3({
	apiVersion: "2006-03-01", 
	credentials: new AWS.Credentials(
		setting("AWS_ACCESS_KEY_ID"), 
		setting("AWS_SECRET_ACCESS_KEY")
	)
});
let stream = require("stream");
let URL = require("url");
let S3_BUCKET = setting("S3_BUCKET");

module.exports.fileUploaded = function (key, callback) {
	let KEY = key;
	let params = { Bucket: S3_BUCKET, Key: KEY };
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
	let KEY = key;
	let params = { Bucket: S3_BUCKET, Key: KEY };
	let url = URL.parse(s3.getSignedUrl("getObject", params));
	url.search = null;
	return URL.format(url);
};

module.exports.uploadFromStream = function (key, type, callback) {
	let KEY = key;
	let pass = new stream.PassThrough();

	let params = { Bucket: S3_BUCKET, Key: KEY, Body: pass, ContentType: type, StorageClass: "REDUCED_REDUNDANCY", CacheControl: "max-age=31536000" };
	s3.upload(params, function (err, data) {
		callback(err, data);
	});

	return pass;
};