// HELP: https://www.npmjs.com/package/mongoose

var mongoose = require('mongoose');
var dbuser = process.env.dbuser;
var dbpass = process.env.dbpass;
var dbinstance = process.env.dbinstance;

if (!dbpass || !dbuser || !dbinstance) {
    throw ("DB SETTINGS NOT CONFIGURED");
}

var connectString = 'mongodb://' + dbuser + ':' + dbpass + '@ds0' + dbinstance + '.mlab.com:' + dbinstance + '/kat'
mongoose.connect(connectString);

var cacheSchemea = mongoose.Schema({
    dateAdded: Number,
    key: String,
    value: String
})

var GifCache = mongoose.model('gifcache', cacheSchemea)

//allowed, blocked, notfound
module.exports.GetCache = function(key, callback) {
    var query = GifCache.where({
        key: key
    });
    query.findOne(function(err, found) {
        if (err) {
            callback({
                err: err
            });
            return;
        };
        if (found) {
            callback(found.value);
            return;
        }
        else {
            callback(null);
            return;
        }
    });
}

module.exports.SetCache = function(key, value, callback) {
    var gifCache = new GifCache();
    gifCache.key = key;
    gifCache.value = value;
    gifCache.dateAdded = new Date();
    gifCache.save(function(err) {
        if (err) {
            callback({
                err: err
            });
            return;
        }
        callback({
            result: key +" added"
        });
        return;
    });
}

module.exports.DeleteCache = function(key, callback) {
    GifCache.findOneAndRemove({
        key: key
    }, function(err, doc, result) {
        if (err) {
            callback({
                err: err
            });
            return;
        }
        callback({
            result: key + " removed from cache"
        });
        return;
    });
}