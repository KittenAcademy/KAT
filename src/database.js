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

const GifsModel = mongoose.model(
	"gifs",
	new mongoose.Schema({
		id: String,
		name: String,
		tags: [String]
	})
);
const GifCacheModel = mongoose.model(
	"gifcache",
	new mongoose.Schema({
		dateAdded: Date,
		key: String,
		value: mongoose.Schema.Types.Mixed
	})
);

module.exports.SearchForGif = name => {
	return new Promise((resolve, reject) => {
		return GifsModel.aggregate([
			{ "$match": { "name": new RegExp(name, "i") } },
			{ $sample: { size: 1 } }
		]).exec((err, result) => {
			if (err) {
				reject(err);
			} else {
				const file = result[0]
				if (!file) {
					reject("Not Found");
				} else {
					resolve({
						name: file.name,
						id: file.id
					})
				}
			}
		});
	})
};

module.exports.RandomGif = () => {
	return new Promise((resolve, reject) => {
		GifsModel.aggregate([
			{ $sample: { size: 1 } }
		]).exec((err, result) => {
			if (err) {
				reject(err);
			} else {
				const file = result[0]
				if (!file) {
					reject("Not Found");
				} else {
					resolve({
						name: file.name,
						id: file.id
					})
				}
			}
		});
	})
};

const test = async () => {
	console.log("Searching For cat", await this.SearchForGif("cat"));
	console.log("Searching For dance", await this.SearchForGif("dance"));
	console.log("Searching For cat", await this.SearchForGif("cat"));
	console.log("RandomGif", await this.RandomGif());
}
// test();

module.exports.FindGifsByTag = /**
 * @param { string } tag
 */
	async tag => {
		// @ts-ignore
		const query = GifsModel.where({
			tags: tag
		});
		return query.find();
	};
/**
* @param { string[] } tags
*/
module.exports.FindGifByTags = async tags => {
	// @ts-ignore
	return GifsModel.findOne({ tags: { $all: tags } });
};

module.exports.FindGif = /**
 * @param {{ id: string; }} file
 */
	async file => {
		// @ts-ignore
		const query = GifsModel.where({
			id: file.id
		});
		return query.findOne();
	};

module.exports.AddGif = /**
 * @param {{ id: string; name: string; tags: string[] }} file
 */
	async file => {
		let gif = new GifsModel();
		gif.id = file.id;
		gif.name = file.name;
		gif.tags = file.tags;
		return gif.save();
	};


//allowed, blocked, notfound
module.exports.GetCache = /**
 * @param {string} cacheKey
 * @param {{ (arg0: any, arg1: string): void; (arg0: string, arg1: any): void; (arg0: string, arg1: any): void; }} callback
 */
	function (cacheKey, callback) {
		// @ts-ignore
		let query = GifCacheModel.where({
			key: cacheKey
		});
		query.findOne(function (err, found) {
			if (err) {
				callback(err, "");
				return;
			}
			if (found) {
				callback("", found.value);
				return;
			}
			else {
				callback(`cache value: "${cacheKey}" not found`, null);
				return;
			}
		});
	};

module.exports.SetCache = function (key, value, callback) {
	let gifCache = new GifCacheModel();
	gifCache.key = key;
	gifCache.value = value;
	gifCache.dateAdded = new Date();
	gifCache.save(function (err) {
		if (err) {
			callback({
				err: err
			});
			return;
		}
		callback({
			result: key + " added"
		});
		return;
	});
};

module.exports.DeleteCache = function (key, callback) {
	GifCacheModel.findOneAndRemove({
		key: key
		// }, function(err, doc, result) {
	}, function (err) {
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