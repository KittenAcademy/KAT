// HELP: https://www.npmjs.com/package/mongoose

let mongoose = require("mongoose");
let setting = require("./settings.js");
let dbuser = setting("dbuser");
let dbpass = setting("dbpass");
let dbinstance = setting("dbinstance");

if (!dbpass || !dbuser || !dbinstance) {
	throw ("DB SETTINGS NOT CONFIGURED");
}

let connectString = `mongodb://${dbuser}:${dbpass}@ds0${dbinstance}.mlab.com:${dbinstance}/kat`;
mongoose.connect(connectString);

let cacheSchemea = mongoose.Schema({
	dateAdded: Date,
	key: String,
	value: mongoose.Schema.Types.Mixed
});

let GifCache = mongoose.model("gifcache", cacheSchemea);

//allowed, blocked, notfound
module.exports.GetCache = function(key, callback) {
	let query = GifCache.where({
		key: key
	});
	query.findOne(function(err, found) {
		if (err) {
			callback(err, "" );
			return;
		}
		if (found) {
			callback("", found.value);
			return;
		}
		else {
			callback(`cache value: "${key}" not found` , null);
			return;
		}
	});
};

module.exports.SetCache = function(key, value, callback) {
	let gifCache = new GifCache();
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
};

module.exports.DeleteCache = function(key, callback) {
	GifCache.findOneAndRemove({
		key: key
	// }, function(err, doc, result) {
	}, function(err) {
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
};