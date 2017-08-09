let Discord = require("discord.io");
let setting = require("../settings.js");
let findfile = require("../drive/findfile.js");
let getlatest = require("../drive/getlatest.js");
let catfacts = require("./module/catfacts.js");
let jokes = require("./module/jokes.js");
const gifs = require("../files/gifs.js"),
	https = require("https");

let bot = new Discord.Client({
	token: setting("DiscordToken"),
	autorun: true
});

let avatar = require("./avatar.js");

bot.on("ready", function () {
	console.log(bot.username + " - (" + bot.id + ")", "ready");
	bot.editUserInfo({
		avatar: avatar, //Optional
		email: "madelk@gmail.com" //Optional
		//new_password: "supersecretpass123", //Optional
		//password: "supersecretpass", //Required
		//username: "Yuna" //Optional
	});
});
bot.on("message", function (user, userID, channelID, message, event) {
	try {
		if (event.d.author.bot) {
			return;
		}
		if (message[0] != "!") {
			return;
		}
		let moduleName = message.split(" ")[0];
		let payload = {
			user: user,
			userID: userID,
			channelID: channelID,
			message: message,
			event: event,
			moduleName: moduleName.replace("!", "").toLowerCase(),
			command: message.replace(moduleName, "").substring(1)
		};
		HandleBotCommand(payload);
	}
	catch (ex) {
		console.error("errorwithbotonmessage", ex);
	}
});
bot.on("disconnected", function () {
	console.log("Bot disconnected reconnecting");
	bot.connect();
});
bot.on("disconnect", function (erMsg, code) {
	console.log("Bot disconnected reconnecting");
	console.log("erMsg", erMsg);
	console.log("code", code);
	bot.connect();
});

function HandleBotCommand(payload) {
	if (payload.moduleName == "allgifs") {
		bot.sendMessage({
			to: payload.channelID,
			message: "Here you go " + payload.user + " these are all my gifs for " + payload.command + " http://kitten.ga/tags.html?tag=" +payload.command
		});
	}
	else if (payload.moduleName == "livestreams") {
		let url = "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UC83RKJs4eKHVE9v0YUyqzgg&eventType=live&maxResults=10&order=viewCount&type=video&key="+ setting("GooleAPIKey")
		https.get(url, (res) => {
			var body = '';

			res.on('data', function(chunk){
				body += chunk;
			});

			res.on('end', function(){
				let result = JSON.parse(body);
				console.log("Got a response: ", result);
				let retval = "Here are the current streams \n"
				for (let i = 0; i < result.items.length; i++) { 
					retval += `${result.items[i].snippet.title}: https://www.youtube.com/watch?v=${result.items[i].id.videoId}\n`;
				}


				bot.sendMessage({
					to: payload.channelID,
					message:retval
				});
			});
		}).on('error', function(e){
			bot.sendMessage({
				to: payload.channelID,
				message:"Oh dear! " + e
			});
		});
	}
	else if (payload.moduleName == "joke") {
		var message = jokes();
		bot.sendMessage({
			to: payload.channelID,
			message:message
		});
	}
	else if (payload.moduleName == "catfact") {
		var message = catfacts();
		bot.sendMessage({
			to: payload.channelID,
			message:message
		});
	}
	else if (payload.moduleName == "latestgif") {
		getlatest(function (file) {
			bot.sendMessage({
				to: payload.channelID,
				message: "Here you go " + payload.user + " this is the most recent gif " + file.name + ": " + file.path
			});
		});
	}
	else if (payload.moduleName == "fixgif") {
		gifs.FixGif(payload.command, function (file) {
			bot.sendMessage({
				to: payload.channelID,
				message: "Fixed " + file
			});
		});
	}
	else if (payload.moduleName == "whosefault") {
		bot.sendMessage({
			to: payload.channelID,
			message: "It's DJ's fault. Don't listen to that liar Toonki!"
		});
	}
	else if (payload.moduleName == "image") {
		findfile(payload.command, function (file) {
			if (!file) {
				bot.sendMessage({
					to: payload.channelID,
					message: "Sorry " + payload.user + " I dunno lol ¯\\_(ツ)_/¯"
				});
				return;
			}
			bot.sendMessage({
				to: payload.channelID,
				message: "Here you go " + payload.user + " I found " + file.name + ": " + file.path
			});
		}, true, "image");
	}
	else if (payload.moduleName == "gif") {
		findfile(payload.command, function (file) {
			if (!file) {
				bot.sendMessage({
					to: payload.channelID,
					message: "Sorry " + payload.user + " I dunno lol ¯\\_(ツ)_/¯"
				});
				return;
			}
			bot.sendMessage({
				to: payload.channelID,
				message: "Here you go " + payload.user + " I found " + file.name + ": " + file.path
			});
		}, true, "gif");
	}
}
