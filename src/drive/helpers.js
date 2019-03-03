const { google } = require("googleapis"),
	{ OAuth2Client } = require("google-auth-library");

module.exports.listFiles = /**
 * @param {any} query
 * @param {OAuth2Client} auth
 * @param {{ (arg0: any): void; (arg0: any): void; }} callback
 */
	function (query, auth, callback) {
		fetchPage(null, fetchPage, auth, query, [], /**
		 * @param {any} error
		 * @param {any[]} files
		 */
			function (error, files) {
				if (error) {
					console.log(error);
					callback(null);
				}
				for (let i = 0; i < files.length; i++) {
					let file = files[i];
					file.name = file.name.toLowerCase();
					if (!file.description) continue;
					file.tags = file.description.split("#").map(/**
				 * @param {{ trim: () => { toLowerCase: () => void; }; }} item
				 */
						function (item) {
							return item.trim().toLowerCase();
						});
				}
				callback(files);
			});
	};

let page = 0;
const fetchPage = /**
 * @param {string} pageToken
 * @param {OAuth2Client} auth
 * @param {string} query
 * @param {any[]} files
 * @param {{ (error: any, files: any): void; (arg0: any, arg1: any): void; }} callback
 */
	async function (pageToken, pageFn, auth, query, files, callback) {
		let drive = google.drive({
			version: 'v3',
			auth: auth,
		});
		console.log(`getting page ${page} from Google`, query)
		drive.files.list({
			q: query,
			fields: "nextPageToken, files(id, name)",
			spaces: "drive",
			pageToken: pageToken
		}).then(res => {
			files.push.apply(files, res.data.files);
			if (res.data.nextPageToken && page < 5) {
			// if (res.data.nextPageToken) {
				page = page + 1;
				pageFn(res.data.nextPageToken, pageFn, auth, query, files, callback);
			} else {
				page = 0;
				callback(null, files);
			}
		}).catch(err => {
			console.log('error when trying to get page from google');
			console.log(err);
			console.log('Retrying in two seconds');
			setTimeout(function () {
				pageFn(pageToken, pageFn, auth, query, files, callback);
			}, 2000);
		});
	};