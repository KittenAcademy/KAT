// https://developers.google.com/drive/api/v3/reference/files/list?apix_params=%7B%22orderBy%22%3A%22modifiedTime%20desc%22%2C%22q%22%3A%22mimeType%20%3D%20%27image%2Fgif%27%20and%20%270BwoBPbVKwbI9TUdFSG0yRjh5UTQ%27%20in%20parents%22%2C%22fields%22%3A%22nextPageToken%2C%20files(id%2C%20name)%22%7D#try-it

const { google } = require("googleapis"),
	driveauth = require("./driveauth.js")

/**
 * @param {string} [pageToken]
 */
module.exports.listRecentlyChangedFiles = async pageToken => {
	const fetchPageResult = await fetchPage(pageToken, {
		"orderBy": "modifiedTime desc",
		"q": "mimeType = 'image/gif' and '0BwoBPbVKwbI9TUdFSG0yRjh5UTQ' in parents",
		"pageSize": 5
	});
	fetchPageResult.files = filesToTags(fetchPageResult.files)
	return fetchPageResult;
}

/**
 * @param {Object[]} files
 * @param {string} files[].name
 * @param {string} files[].description
 * @param {string[]} files[].tags
 */
const filesToTags = files => {
	for (let i = 0; i < files.length; i++) {
		let file = files[i];
		if (!file.name) continue;
		file.name = file.name.toLowerCase();
		file.tags = getTagsFromFileName(file.name);
	}
	return files;
}

/**
 * @param {string} fileName
 */
const getTagsFromFileName = module.exports.getTagsFromFileName = fileName => {
	let retval = fileName.replace(/\.[^/.]+$/, "").split("_").map(item => item.trim().toLowerCase())
	retval = retval.filter(function(elem, pos) {
		return retval.indexOf(elem) == pos;
	});
	return retval;
};

module.exports.listAllFiles = async () => {
	const files = [];
	let nextPageToken = null;
	let page = 1;
	do {
		const fetchPageResult = await fetchPage(null, { q: "mimeType = 'image/gif' and '0BwoBPbVKwbI9TUdFSG0yRjh5UTQ' in parents" })
		nextPageToken = fetchPageResult.nextPageToken;
		files.push.apply(files, filesToTags(fetchPageResult.files));
		files.push.apply(files, fetchPageResult.files);
		page = page + 1;
	}
	// while (nextPageToken);
	while (nextPageToken && page < 3);
	return files;
};

/**
 * @param {string} pageToken
 * @param {any} query
 */
const fetchPage = async (pageToken, query) => {
	const auth = await driveauth();
	let drive = google.drive({
		version: 'v3',
		auth: auth,
	});
	return new Promise((resolve, reject) => {
		query.fields = "nextPageToken, files(id, name)";
		query.spaces = "drive";
		query.pageToken = pageToken;
		// console.log("getting ", query, " from Google drive")
		drive.files.list(query).then(res => {
			resolve(res.data);
		}).catch(err => {
			console.log('error when trying to get page from google');
			console.log(err);
			console.log('Retrying in two seconds');
			setTimeout(() => {
				fetchPage(pageToken, query);
			}, 2000);
		});
	});
};