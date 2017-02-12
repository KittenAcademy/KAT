//https://console.developers.google.com/apis/credentials/consent?project=beaming-team-148423
let googleAuth = require("google-auth-library");
let database = require("../database.js");
let setting = require("../settings.js");

let SCOPES = [
	"https://www.googleapis.com/auth/drive.metadata.readonly",
	"https://www.googleapis.com/auth/drive.photos.readonly",
	"https://www.googleapis.com/auth/drive.readonly"
];


// let TOKEN_PATH =  path.join(__dirname,"..", "cache", "drivetoken.json"); //TOKEN_DIR + "drivetoken.json";

//TODO: Cache the auth token

function GetOauth2Client(callback) {
	let credentials = setting("ClientSecret");
	let clientSecret = credentials.installed.client_secret;
	let clientId = credentials.installed.client_id;
	let redirectUrl = credentials.installed.redirect_uris[0];
	let auth = new googleAuth();
	let oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
	callback({ success: true, message: oauth2Client });
}

module.exports.GetAuthURL = function (callback) {
	GetOauth2Client(function (oauth2Clientret) {
		if (!oauth2Clientret.success) {
			callback(oauth2Clientret);
			return;
		}
		let oauth2Client = oauth2Clientret.message;
		let authUrl = oauth2Client.generateAuthUrl({
			access_type: "offline",
			scope: SCOPES
		});
		callback({ success: true, message: authUrl });
	});
};

module.exports.UseCode = function (code, callback) {
	GetOauth2Client(function (oauth2Clientret) {
		if (!oauth2Clientret.success) {
			callback(oauth2Clientret);
			return;
		}
		let oauth2Client = oauth2Clientret.message;
		oauth2Client.getToken(code, function (err, token) {
			if (err) {
				callback({ success: false, message: err });
				return;
			}
			oauth2Client.credentials = token;
			storeToken(token, callback);
		});
	});
};

function storeToken(token, callback) {
	// try {
	//   fs.mkdirSync(TOKEN_DIR);
	// }
	// catch (err) {
	//   if (err.code != "EEXIST") {
	//	 callback({success: false, message: err});
	//	 return;
	//   }
	// }
	database.SetCache("drivetoken", token, function (result) {
		callback({ success: true, message: result });
	});
}
