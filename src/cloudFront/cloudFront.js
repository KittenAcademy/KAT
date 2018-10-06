let AWS = require("aws-sdk");
// let setting = require("../settings.js");
// let cloudFront = new AWS.CloudFront({
// 	apiVersion: "2018-06-18", 
// 	credentials: new AWS.Credentials(
// 		setting("AWS_ACCESS_KEY_ID"), 
// 		setting("AWS_SECRET_ACCESS_KEY")
// 	)
// });

module.exports.getURL = function(key){
	// let KEY = key;
	// let params = { Bucket: S3_BUCKET, Key: KEY };
	// let url = URL.parse(cloudFront.getSignedUrl("getObject", params));
	// url.search = null;
	// return URL.format(url);
	return "http://d2hjowy56oi5vk.cloudfront.net/" + key
};
