module.exports.pickFileFromArray = (filesArray) => {
	const scoreToMatch = filesArray[0].score - 1.0;
	const filesMatchingScore = filesArray.filter(file => file.score > scoreToMatch);
	const randomSelection = this.pickSomethingAtRandom(filesMatchingScore);
	return randomSelection;
};

module.exports.findMatches = (stringToFind, filesArray) => {
	return filesArray.map(file => {
		file.matches = file.tagsCopy.diff(stringToFind).length;
		return file;
	});
};
module.exports.bestMatches = filesArray => {
	const bestMatches = Math.max.apply(Math, filesArray.map(function (o) { return o.matches; }));
	return filesArray.filter(file => file.matches == bestMatches);
};
Array.prototype.diff = function (arr2) {
	var ret = [];
	for (var i in this) {
		if (arr2.indexOf(this[i]) > -1) {
			ret.push(this[i]);
		}
	}
	return ret;
};
module.exports.makeTagsDistinct = filesArray => {
	return filesArray.map(file => {
		file.tagsCopy = [...new Set(file.tagsCopy)];
		return file;
	});
};
module.exports.pickSomethingAtRandom = filesArray => {
	if (filesArray.length === 1) return filesArray[0];
	const indexToUse = Math.floor(Math.random() * filesArray.length);
	return filesArray[indexToUse];
};