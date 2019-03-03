//https://console.developers.google.com/apis/credentials/consent?project=beaming-team-148423
const { OAuth2Client } = require("google-auth-library"),
	database = require("../database.js"),
	setting = require("../settings.js");
	
module.exports = async () => {
	let cache = GetCache();
	if (cache) {
		return(cache);
	}
	return await authorize(setting("ClientSecret"));
};

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 */
const authorize = credentials => {
	return new Promise((resolve, reject) => {
		const oAuth2Client = new OAuth2Client(
			credentials.installed.client_id,
			credentials.installed.client_secret,
			credentials.installed.redirect_uris[0]
		);

		// Check if we have previously stored a token.
		database.GetCache("drivetoken", function (err, token) {
			if (err || Object.keys(token).length === 0) {
				console.log("err when reading token", err, "drivetoken");
				reject();
			} else {
				oAuth2Client.credentials = token;
				resolve(oAuth2Client);
				AddCache(oAuth2Client);
			}
		});
	})
}


let Cache = {};

function GetCache() {
	if (Cache.expires > new Date().getTime()) {
		return Cache.value;
	} else {
		// console.log("no token in cache")
		return null;
	}
}

function AddCache(value) {
	// console.log("adding token to cache", value)
	Cache.value = value;
}
