module.exports.pickFileFromArray = (stringToFind, filesArray) => {
	const distinctFilesArray = this.makeTagsDistinct(filesArray);
	const withMatches = this.findMatches(stringToFind, distinctFilesArray);
	const bestMatches = this.bestMatches(withMatches);
	const chosenOne = this.pickSomethingAtRandom(bestMatches);
	return chosenOne;
};

module.exports.findMatches = (stringToFind, filesArray) => {
	return filesArray.map(file => {
		file.matches = file.tagsCopy.diff(stringToFind).length;
		return file;
	});
};
module.exports.bestMatches = filesArray => {
	const bestMatches = Math.max.apply(Math, filesArray.map(function(o) { return o.matches; }));
	return filesArray.filter(file => file.matches == bestMatches);
};
Array.prototype.diff = function(arr2) {
    var ret = [];
    for(var i in this) {   
        if(arr2.indexOf(this[i]) > -1){
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
	return filesArray[Math.floor(Math.random()*filesArray.length)];
};