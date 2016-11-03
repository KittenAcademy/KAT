//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var express = require('express');
var randomgif = require('./drive/randomgif.js');

var router = express();
var server = http.createServer(router);

router.get('/gif', function(req, res) {
    randomgif(function(gifid) {
        var options = {
            // root: __dirname + '/public/',
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true,
                'Content-Type': 'image/gif'
            }
        };
        var filepath = path.join(__dirname, 'temp', gifid);
        console.log('filepath',filepath);
        res.sendFile(filepath, options, function(err) {
            if (err) {
                console.log(err);
                res.status(err.status).end();
            }
            else {
                console.log('Sent:', gifid);
            }
        });
    })
})
router.use(express.static(path.resolve(__dirname, 'client')));

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
    var addr = server.address();
    console.log("Server listening at", addr.address + ":" + addr.port);
});
