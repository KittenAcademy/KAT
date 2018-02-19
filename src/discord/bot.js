const Discord = require('discord.js');
let setting = require("../settings.js");
let findfile = require("../drive/findfile.js");
let getlatest = require("../drive/getlatest.js");
let catfacts = require("./module/catfacts.js");
let jokes = require("./module/jokes.js");
const gifs = require("../files/gifs.js"),
	https = require("https");

let bot = new Discord.Client();
bot.login(setting("DiscordToken"));
let avatar = require("./avatar.js");

bot.on("ready", function () {
	console.log(bot.username + " - (" + bot.id + ")", "ready");
	// console.log(bot.channels.get("name", "bottest"));

	// bot.channels.get("328194320601710593").send(":eyes:")
	// bot.user.setAvatar(avatar);
	// bot.channels.find(x => x.name === "bottest").send("Beware I live")
});

module.exports.SendMessage = (room, message) => {
	bot.channels.find(x => x.name === room).send(message)
}
bot.on("message", function (event) {
	try {
		if (event.author.bot) {
			return;
		}
		if (event.content[0] != "!") {
			return;
		}
		let moduleName = event.content.split(" ")[0];
		let payload = {
			user: event.author.username,
			userID: event.author.id,
			channelID: event.channel.id,
			message: event.content,
			event: event,
			moduleName: moduleName.replace("!", "").toLowerCase(),
			command: event.content.replace(moduleName, "").substring(1)
		};
		HandleBotCommand(payload, event.channel);
	}
	catch (ex) {
		console.error("errorwithbotonmessage", ex);
	}
});
bot.on("disconnected", function () {
	console.log("Bot disconnected reconnecting");
	bot.connect();
});
bot.on("disconnect", function (erMsg, code, something) {
	console.log("Bot disconnected reconnecting");
	console.log("erMsg", erMsg);
	console.log("code", code);
	console.log("something", something);
	bot.disconnect();
	bot.connect();
});

function HandleBotCommand(payload, channel) {
	if (payload.moduleName == "allgifs") {
		channel.send("Here you go " + payload.user + " these are all my gifs for " + payload.command + " http://kitten.ga/tags.html?tag=" +payload.command);
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
				channel.send(retval);
			});
		}).on('error', function(e){
			channel.send("Oh dear! " + e);
		});
	}
	else if (payload.moduleName == "joke") {
		var message = jokes();
		channel.send(message);
	}
	else if (payload.moduleName == "catfact") {
		var message = catfacts();
		channel.send(message);
	}
	else if (payload.moduleName == "latestgif") {
		getlatest(function (file) {
			channel.send("Here you go " + payload.user + " this is the most recent gif " + file.name + ": " + file.path);
		});
	}
	else if (payload.moduleName == "fixgif") {
		gifs.FixGif(payload.command, function (file) {
			channel.send("Fixed " + file);
		});
	}
	else if (payload.moduleName == "whosefault") {
		channel.send("It's DJ's fault. Don't listen to that liar Toonki!");
	}
	else if (payload.moduleName == "image") {
		findfile(payload.command, function (file) {
			if (!file) {
				channel.send("Sorry " + payload.user + " I dunno lol ¯\\_(ツ)_/¯");
				return;
			}
			channel.send( "Here you go " + payload.user + " I found " + file.name + ": " + file.path);
		}, true, "image");
	}
	else if (payload.moduleName == "gif") {
		findfile(payload.command, function (file) {
			if (!file) {
				channel.send("Sorry " + payload.user + " I dunno lol ¯\\_(ツ)_/¯");
				return;
			}


			const embed = new Discord.RichEmbed()
			.setTitle(file.name)
			// .setAuthor("Author Name", "https://i.imgur.com/lm8s41J.png")
			/*
			 * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
			 */
			.setColor(0xBADA55)
			.setDescription("Here you go " + payload.user + " I found a gif for you")
			.setImage(file.path)
			.setTimestamp()
			.setURL(file.path)
			// .addField("This is a field title, it can hold 256 characters",
				// "This is a field value, it can hold 2048 characters.")
			/*
			 * Inline fields may not display as inline if the thumbnail and/or image is too big.
			 */
			// .addField("Inline Field", "They can also be inline.", true)
			/*
			 * Blank field, useful to create some space.
			 */
			// .addBlankField(true)
			// .addField("Inline Field 3", "You can have a maximum of 25 fields.", true);
		
			channel.send({embed});



			// channel.send("Here you go " + payload.user + " I found " + file.name + ": " + file.path);
		}, true, "gif");
	}
}
