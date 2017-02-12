//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
let http = require("http");
let driveauth = require("./src/drive/auth.js");
let express = require("express");
let randomgif = require("./src/drive/randomgif.js");
let findfile = require("./src/drive/findfile.js");
// let streamgif = require("./drive/stream.js");
require("./src/discord/bot.js");

let gifs = require("./src/files/gifs.js");

let app = express();
let server = http.createServer(app);

app.get("/AuthGetURL", function(req, res) {
	driveauth.GetAuthURL(function(response) {
		res.json(response);
	});
});
app.get("/AuthUseCode", function(req, res) {
	driveauth.UseCode(req.query.code, function(response) {
		res.json(response);
	});
});
app.get("/getgifids", function(req, res) {
	res.json(randomgif());
});
app.get("/find", function(req, res) {
	findfile(req.query.text, function(filename) {
		res.json(filename);
	});
});
app.get("/tags", function(req, res) {
	findfile(req.query.text, function(files) {
		res.json(files);
	}, false);
});
app.use("/", express.static(__dirname + "/client"));
// app.get("/gifs/*", streamgif);
app.get("/gifs/*", function(req, res) {
	let gifid = req.url.replace("/gifs/", "").replace(".gif", "");
	gifs.GetGifURL(gifid, function(fileurl){
		res.redirect(301, fileurl);
	});
});

// app.use("/", express.static(path.resolve(__dirname, "client")));
// app.use("cache", express.static("gifs"))
// app.use(express.static("cache"))

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
	let addr = server.address();
	console.log("Server listening at", addr.address + ":" + addr.port);
});
