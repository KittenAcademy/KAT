//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
import express from "express";
import http from "http";
import { GetAuthURL, UseCode } from "./drive/auth";
import randomgif from "./drive/randomgif";
import { FindGifsByExactTags, init } from "./database";
import { connectToDiscord } from "./discord/bot";
import { pollForGifsInDrive } from "./files/gifs";
import { getEntry } from "./files/bulkdownload";

let app = express();
let server = http.createServer(app);

app.get("/AuthGetURL", function (req, res) {
  GetAuthURL(function (response: any) {
    res.json(response);
  });
});
app.get("/AuthUseCode", function (req, res) {
  UseCode(req.query.code, function (response: any) {
    res.json(response);
  });
});
app.get("/getgifids", function (req, res) {
  res.json(randomgif());
});
app.get("/tags", async (req, res) => {
  const files = await FindGifsByExactTags(
    (req.query.text as string).split(" ")
  );
  res.json(files);
});
app.get("/bulkdownload", function (req, res) {
  res.json(getEntry(req.query.key as string));
});
app.use("/", express.static(__dirname + "/../client"));
app.get("/gifs/*", function (req, res) {
  let gifid = req.url.replace("/gifs/", "").replace(".gif", "");
});

const port = process.env.PORT || 3000;
const hostname: string = process.env.IP || "0.0.0.0";
const backlog = 511;
const callback = function () {
  console.log("Server listening at", `${hostname}:${port}`);
};

init.then(async () => {
  server.listen(port as number, hostname, backlog, callback);
  pollForGifsInDrive();
  connectToDiscord();
});
