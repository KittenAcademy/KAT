var google = require('googleapis');
module.exports.listFiles = function(query, auth, callback) {
    var service = google.drive('v3');
    //https://developers.google.com/drive/v3/reference/files/list
    service.files.list({
        auth: auth,
        q: query,
        //https://developers.google.com/drive/v3/reference/files/list#try-it https://developers.google.com/drive/v3/web/search-parameters
        pageSize: 1000,
        fields: "nextPageToken, files(id, name, description)"
    }, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        var files = response.files;
        if (files.length == 0) {
            console.log('No files found.');
        }
        else {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                file.name = file.name.toLowerCase();
                if (!file.description) continue;
                //file.tags = file.description.ToLower().split('#');
                file.tags = file.description.split("#").map(function(item) {
                    return item.trim().toLowerCase();
                });
            }
            //   console.log('Files:');
            //   for (var i = 0; i < files.length; i++) {
            //     var file = files[i];
            //     console.log('%s (%s)', file.name, file.id);
            //   }
            callback(files);
        }
    });
}