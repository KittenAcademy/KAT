

const privatesettings = require("./privatesettings.js");

module.exports = /**
 * @param {string} settingName
 */
	function (settingName) {
		let retval = process.env[settingName];
		if (!retval) {
			try {
				retval = privatesettings[settingName];
			}
			catch (err) {
				console.log(err);
			}
		}
		if (retval) {
			try {
				retval = JSON.parse(retval);
			}
			catch (err) {
				// No need to deal with error, just trying to parse in case
			}
			return retval;
		}

		return null;

	};