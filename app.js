//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');
var discord = require('./discord/bot.js')
var driveauth = require('./drive/auth.js');
var express = require('express');
var randomgif = require('./drive/randomgif.js');
var findfile = require('./drive/findfile.js');
// var streamgif = require('./drive/stream.js');

var gifs = require('./files/gifs.js');

var app = express();
var server = http.createServer(app);

app.get('/AuthGetURL', function(req, res) {
    driveauth.GetAuthURL(function(response) {
        res.json(response);
    })
})
app.get('/AuthUseCode', function(req, res) {
    driveauth.UseCode(req.query.code, function(response) {
        res.json(response);
    })
})
app.get('/getgifids', function(req, res) {
    res.json(randomgif());
})
app.get('/find', function(req, res) {
    findfile(req.query.text, function(filename) {
        res.json(filename);
    });
})
app.get('/tags', function(req, res) {
    findfile(req.query.text, function(files) {
        res.json(files);
    }, false);
})
app.use('/', express.static(__dirname + '/client'));
// app.get('/gifs/*', streamgif);
app.get('/gifs/*', function(req, res) {
    var gifid = req.url.replace('/gifs/', '').replace('.gif', '');
    gifs.GetGifURL(gifid, function(fileurl){
        res.redirect(301, fileurl)
    });
})

// app.use('/', express.static(path.resolve(__dirname, 'client')));
// app.use('cache', express.static('gifs'))
// app.use(express.static('cache'))

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
    var addr = server.address();
    console.log("Server listening at", addr.address + ":" + addr.port);
});
