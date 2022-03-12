//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
import express, {} from 'express';
let http = require("http");
let driveauth = require("./drive/auth.js");
let randomgif = require("./drive/randomgif.js");
let databaseDal = require("./database");

let app = express();
let server = http.createServer(app);

app.get("/AuthGetURL", function(req, res) {
	driveauth.GetAuthURL(function(response: any) {
		res.json(response);
	});
});
app.get("/AuthUseCode", function(req, res) {
	driveauth.UseCode(req.query.code, function(response: any) {
		res.json(response);
	});
});
app.get("/getgifids", function(req, res) {
	res.json(randomgif());
});
app.get("/tags", async (req, res) => {
	const files = await databaseDal.FindGifsByTag(req.query.text)
	res.json(files);
});
app.use("/", express.static(__dirname + "/client"));
app.get("/gifs/*", function(req, res) {
	let gifid = req.url.replace("/gifs/", "").replace(".gif", "");
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
	let addr = server.address();
	console.log("Server listening at", addr.address + ":" + addr.port);
});
