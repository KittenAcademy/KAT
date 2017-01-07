var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var stream = require('stream');
var URL = require('url');
var setting = require('../settings.js');
var S3_BUCKET = setting('S3_BUCKET');
var AWS_ACCESS_KEY_ID = setting('AWS_ACCESS_KEY_ID');
var AWS_SECRET_ACCESS_KEY = setting('AWS_SECRET_ACCESS_KEY');
process.env['AWS_ACCESS_KEY_ID'] = AWS_ACCESS_KEY_ID;
process.env['AWS_SECRET_ACCESS_KEY'] = AWS_SECRET_ACCESS_KEY;

module.exports.fileUploaded = function (key, callback) {
    var KEY = key;
    var params = { Bucket: S3_BUCKET, Key: KEY };
    s3.headObject(params, function (err, data) { //4332406
        if (err && err.code == 'NotFound' || data.ContentLength < 1000) {
            callback(false);
        }
        else {
            callback(true);
        }
    })
}

module.exports.getURL = function(key){
    var KEY = key;
    var params = { Bucket: S3_BUCKET, Key: KEY };
    var url = URL.parse(s3.getSignedUrl('getObject', params));
    url.search = null;
    return URL.format(url);
}

module.exports.uploadFromStream = function (key, type, callback) {
    var KEY = key;
    var pass = new stream.PassThrough();

    var params = { Bucket: S3_BUCKET, Key: KEY, Body: pass, ContentType: type, StorageClass: 'REDUCED_REDUNDANCY', CacheControl: "max-age=31536000" };
    s3.upload(params, function (err, data) {
        callback(err, data);
    });

    return pass;
}
module.exports.test = function () {
    // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html



    var params = { Bucket: S3_BUCKET, Key: 'testkey', Body: 'Hello!' };

    s3.putObject(params, function (err, data) {
        if (err) {
            console.log(err)
        } else {
            console.log("Successfully uploaded data to myBucket/myKey");
        }
    });
    // https://kittenacademy.s3-website-us-west-2.amazonaws.com/testkey

    newparams = { Bucket: S3_BUCKET, Key: 'testkey' };
    s3.getObject(newparams, function (err, data) {
        console.log(err, data)
    })
    s3.headObject(newparams, function (err, data) {
        if (err && err.code == 'NotFound') {
            console.log('not found')
        }
        else {
            console.log('found');
        }
    })
    // var url = s3.getSignedUrl('getObject', newparams);
    // console.log('The URL is', url);

    // inputStream.pipe(uploadFromStream(s3));


}