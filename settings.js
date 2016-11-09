
module.exports = function (settingName) {
    var retval = process.env[settingName];
    if (!retval) {
        try {
            var privatesettings = require('./privatesettings.js')
            retval = privatesettings[settingName];
        }
        catch(err) {
            
        }
    }
    if (retval){
        try
        {
           retval = JSON.parse(retval);
        }
        catch(e)
        {
            
        }
        return retval;
    }
    
    return null;

}