
module.exports = function (settingName) {
    var retval = process.env[settingName];
    if (retval) return retval;
    try {
        var privatesettings = require('./privatesettings.js')
        retval = privatesettings[settingName];
        if (retval) return retval;
    }
    catch(err) {
        
    }
    return null;

}