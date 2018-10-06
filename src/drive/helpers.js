let google = require("googleapis");
module.exports.listFiles = function (query, auth, callback) {
	fetchPage(null, fetchPage, auth, query, [], function(error, files){
		if (error) {
			console.log(error);
			callback(null);
		}
		for (let i = 0; i < files.length; i++) {
			let file = files[i];
			file.name = file.name.toLowerCase();
			if (!file.description) continue;
			file.tags = file.description.split("#").map(function (item) {
				return item.trim().toLowerCase();
			});
		}
		callback(files);
	});
};

let page = 0;
const fetchPage = function (pageToken, pageFn, auth, query, files, callback) {
	let drive = google.drive("v3");
	console.log(`getting page ${page} from Google`, query)
	drive.files.list({
		auth: auth,
		q: query,
		fields: "nextPageToken, files(id, name)",
		spaces: "drive",
		pageToken: pageToken
	}, function (err, res) {
		if (err) {
			console.log('error when trying to get page from google');
			console.log(err);
			console.log('Retrying in two seconds');
			setTimeout(function(){
				pageFn(pageToken, pageFn, auth, query, files, callback);
			}, 2000);
		} else {
			files.push.apply(files, res.files);
			if (res.nextPageToken) {
				page = page + 1;
				pageFn(res.nextPageToken, pageFn, auth, query, files, callback);
			} else {
				page = 0;
				callback(null, files);
			}
		}
	});
};