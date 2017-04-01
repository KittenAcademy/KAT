let google = require("googleapis");
module.exports.listFiles = function (query, auth, callback) {
	fetchPage(null, fetchPage, auth, query, [], function(error, files){
		console.log(files.length);
		for (let i = 0; i < files.length; i++) {
			let file = files[i];
			file.name = file.name.toLowerCase();
			if (!file.description) continue;
			//file.tags = file.description.ToLower().split("#");
			file.tags = file.description.split("#").map(function (item) {
				return item.trim().toLowerCase();
			});
		}
		callback(files);
	});
};

const fetchPage = function (pageToken, pageFn, auth, query, files, callback) {
	let drive = google.drive("v3");
	drive.files.list({
		auth: auth,
		q: query,
		fields: "nextPageToken, files(id, name)",
		spaces: "drive",
		pageToken: pageToken
	}, function (err, res) {
		if (err) {
			callback(err);
		} else {
			files.push.apply(files, res.files);
			if (res.nextPageToken) {
				// console.log("Page token", res.nextPageToken);
				pageFn(res.nextPageToken, pageFn, auth, query, files, callback);
			} else {
				callback(null, files);
			}
		}
	});
};