const cloudFront = require("../cloudFront/cloudFront.js"),
	gifDal = require("../drive/dal"),
	databaseDal = require("../database"),
	s3 = require("../s3/s3"),
	drivestream = require("../drive/returnstream.js"),
	driveauth = require("../drive/driveauth.js");

module.exports.GetGifURL = gifid => cloudFront.getURL(gifid + ".gif");
;

module.exports.updateNewGifs = /**
 * @param {string} nextPage
 */
	async nextPage => {
		const recentlyChangedFiles = await gifDal.listRecentlyChangedFiles(nextPage);
		// let aFileWasFound;
		nextPage = recentlyChangedFiles.nextPageToken;
		for (let i = 0; i < recentlyChangedFiles.files.length; i++) {
			const recentlyChangedFile = recentlyChangedFiles.files[i];
			if (await databaseDal.FindGif(recentlyChangedFile)) {
				// TODO Check if GIF is uploaded and upload anyway if missing
				// TODO check if gif in DB matches what is parsed from the gifDal
			} else {
				await uploadGif(recentlyChangedFile.id);
				await databaseDal.AddGif(recentlyChangedFile);
			}
		}
		if (nextPage) {
			await this.updateNewGifs(nextPage);
		}
	}

this.updateNewGifs();

const uploadGif = async fileid => {
	let filename = fileid + ".gif";
	const auth = await driveauth();
	return new Promise((resolve, reject) => {
	s3.fileUploaded(filename, function (isUploaded) {
		if (isUploaded) {
			resolve();
		} else {
			const metatag = "image/jpeg";
			drivestream(fileid, auth, s3.uploadFromStream(filename, metatag, resolve));
		}
	});
});
}

// module.exports.FixGif = function (gifid, callback) {
// 	let filename = gifid;
// 	if (gifid.indexOf(".gif") == -1) {
// 		filename = filename + ".gif";
// 	} else {
// 		gifid = gifid.replace(".gif", "");
// 	}
// 	s3.deleteFile(filename, function (success) {
// 		if (!success) {
// 			callback("failed");
// 			return;
// 		}
// 		returnStream(gifid, function (inputStream) {
// 			inputStream.pipe(s3.uploadFromStream(filename, "image/gif", function () { // err, data
// 				callback(s3.getURL(filename));
// 			}));
// 		});
// 	});
// };