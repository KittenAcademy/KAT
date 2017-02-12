
module.exports = function (settingName) {
	var retval = process.env[settingName];
	if (!retval) {
		try {
			var privatesettings = require("./privatesettings.js");
			retval = privatesettings[settingName];
		}
		catch(err) {
			console.log(err);
		}
	}
	if (retval){
		try
		{
			retval = JSON.parse(retval);
		}
		catch (err) {
			// No need to deal with error, just trying to parse in case
		}
		return retval;
	}
	
	return null;

};