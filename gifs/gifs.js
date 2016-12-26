var s3 = require('../s3/s3.js');
var drivestream = require('../drive/returnstream.js');

module.exports.GetGifURL = function(gifid, callback){
    s3.fileUploaded(gifid, function(isUploaded){
        if (isUploaded){
            callback(s3.getURL(gifid));
        } else {
            drivestream(gifid, function(inputStream){
                inputStream.pipe(s3.uploadFromStream(gifid, function(err, data){
                    callback(s3.getURL(gifid));
                }));
            })
        }
    })
    // callback({name:'test', path:'/'});
}