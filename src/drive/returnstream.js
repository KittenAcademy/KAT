let { google } = require("googleapis");
let fs = require("fs");

let dir = "./cache";

if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir);
}

// module.exports = function (fileId, auth) {
// 	let drive = google.drive({
// 		version: "v3",
// 		auth: auth
// 	});
// 	return drive.files.export({
// 		fileId: fileId,
// 		alt: "media"
// 	});
// }


module.exports = async function (fileId, auth, dest) {
	let drive = google.drive({
		version: "v3",
		auth: auth
	});
	return new Promise(async (resolve, reject) => {
	  let progress = 0;
	  const res = await drive.files.get(
		{fileId, alt: 'media'},
		{responseType: 'stream'}
	  );
	  res.data
		.on('end', () => {
		  console.log('Done downloading file.', fileId);
		  resolve();
		})
		.on('error', err => {
		  console.error('Error downloading file.', fileId);
		  reject(err);
		})
		.on('data', d => {
		  progress += d.length;
		  if (process.stdout.isTTY) {
			process.stdout.clearLine();
			process.stdout.cursorTo(0);
			process.stdout.write(`Downloaded ${progress} bytes`);
		  }
		})
		.pipe(dest);
	});
  }