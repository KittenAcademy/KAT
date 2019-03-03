const databaseDal = require("../database"),
	cloudFront = require("../cloudFront/cloudFront"),
	UpcomingFiles = new Array();

/**
 * @param {boolean} [cantloop]
 */
const GetFiles = async cantloop => {
	if (!cantloop) cantloop = false;
	const file = await databaseDal.RandomGif();
	let filePath = cloudFront.getURL(file.id+".gif");
	// if (UpcomingFiles.indexOf(upcomingFile) > -1) { //don"t add a dupe to the upcoming list
	//	 GetFiles();
	//	 return;
	// } 
	if (UpcomingFiles.length < 3 && !cantloop) {
		GetFiles(true);
	} else {
		UpcomingFiles.splice(0, 1);
	}
	UpcomingFiles.push({
		filePath: filePath,
		tags: file.tags,
		name: file.name
	});
}

function RunLoop() {
	setTimeout(function () {
		GetFiles();
		RunLoop();
	}, 10000);
}
RunLoop();

module.exports = function () {
	return UpcomingFiles;
};