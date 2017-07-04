let CatFactWords = require("./catfactswords.js");
let moment = require("moment");
let catFactWait = 1; //mins between catfact
let lastCatfact = moment([2016, 1, 1]);

module.exports = function (payload, callback) {
	return getRandomFact();
};

function IsLastCatFactTooRecent() {
	let a = moment();
	let b = moment(lastCatfact);
	let minsBetweenCatfacts = a.diff(b, "minutes");
	if (minsBetweenCatfacts < catFactWait) return true;
	return false;
}

function getRandomFact() {
	if (IsLastCatFactTooRecent()) {
		return "Please wait before getting another CatFact";
		// return ({ messageToSend: "Please wait before getting another CatFact", dm: true });
	}
	lastCatfact = moment();
	return CatFactWords[Math.floor(Math.random() * CatFactWords.length)];
}

console.log("You are using catfacts. Don't forget ", getRandomFact());
lastCatfact = moment([2016, 1, 1]); //reset catfacts last time