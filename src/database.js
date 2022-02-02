// HELP: https://www.npmjs.com/package/mongoose

let mongoose = require("mongoose");
let setting = require("./settings.js");
let driveDal = require("./drive/dal.js");
let dbuser = setting("dbuser");
let dbpass = setting("dbpass");
let dbinstance = setting("dbinstance");
let dbconnection = setting("dbconnection");
if ((!dbpass || !dbuser || !dbinstance) && !dbconnection) {
	throw "DB SETTINGS NOT CONFIGURED";
}
let connectString = setting("dbconnection") || `mongodb+srv://${dbuser}:${dbpass}@kat.pdpvx.mongodb.net/${dbinstance}?retryWrites=true&w=majority`;
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
	return GifsModel.aggregate([
		{ $match: { name: new RegExp(name, "i") } },
		{ $sample: { size: 1 } }
	]).exec();
};

module.exports.RandomGif = () => {
	return new Promise((resolve, reject) => {
		GifsModel.aggregate([{ $sample: { size: 1 } }]).exec((err, result) => {
			if (err) {
				reject(err);
			} else {
				const file = result[0];
				if (!file) {
					reject("Not Found");
				} else {
					resolve({
						name: file.name,
						id: file.id
					});
				}
			}
		});
	});
};

const test = async () => {
	console.log("Searching For cat", await this.SearchForGif("cat"));
	console.log("Searching For dance", await this.SearchForGif("dance"));
	console.log("Searching For cat", await this.SearchForGif("cat"));
	console.log("RandomGif", await this.RandomGif());
};
// test();

/**
 * @param { string } tag
 */
module.exports.FindGifsByTag = async tag => {
	// @ts-ignore
	const query = GifsModel.where({
		tags: tag
	});
	return query.find();
};
/**
 * @param { string[] } tagsArray
 */
module.exports.FindGifByTags = async tagsArray => {
	console.log("looking for", tagsArray)
	// @ts-ignore
	var retval = await GifsModel.aggregate(
	).search({
		'index': 'kat-gifs',
		'text': {
			'query': tagsArray.join(" "),
			'path': {
				'wildcard': '*'
			}
		}
	}).project({
		id: 1,
		name: 1,
		score: { $meta: "searchScore" }
	}).limit(10);
	// .exec();
	return retval;
};

module.exports.FindGif = /**
 * @param {{ id: string; }} file
 */ async file => {
		// @ts-ignore
		const query = GifsModel.where({
			id: file.id
		});
		return query.findOne();
	};

module.exports.AddGif = /**
 * @param {{ id: string; name: string; tags: string[] }} file
 */ async file => {
		let gif = new GifsModel();
		gif.id = file.id;
		gif.name = file.name;
		gif.tags = file.tags;
		return gif.save();
	};

module.exports.RenameGif = /**
* @param {string} oldName old filename or id
* @param {string} newName new filename
*/ async (oldName, newName) => {
		const newTags = driveDal.getTagsFromFileName(newName);
		const query = (condition) => GifsModel.findOneAndUpdate(
			condition,
			{
				$set: {
					name: newName,
					tags: newTags
				}
			},
			{
				useFindAndModify: false,
				new: true
			}
		);
		// Prioritize gifs with a matching name over gifs with a matching id, in case a file name is a duplicate of some id.
		return (await query({name: oldName})) || (await query({id: oldName}));
	};

//allowed, blocked, notfound
module.exports.GetCache = /**
 * @param {string} cacheKey
 * @param {{ (arg0: any, arg1: string): void; (arg0: string, arg1: any): void; (arg0: string, arg1: any): void; }} callback
 */ function (cacheKey, callback) {
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
			} else {
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
	GifCacheModel.findOneAndRemove(
		{
			key: key
			// }, function(err, doc, result) {
		},
		function (err) {
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
		}
	);
};
