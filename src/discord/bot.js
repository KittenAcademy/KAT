const Discord = require('discord.js'),
	setting = require("../settings.js"),
	findfile = require("../drive/findfile.js"),
	getlatest = require("../drive/getlatest.js"),
	catfacts = require("./module/catfacts.js"),
	jokes = require("./module/jokes.js"),
	gifs = require("../files/gifs.js"),
	https = require("https"),
	client = new Discord.Client();

const connectToDiscord = () => {
	client.login(setting("DiscordToken"));
};
connectToDiscord();

client.on("message", function (event) {
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

client.on("disconnect", function (erMsg, code, something) {
	console.log("Bot disconnected reconnecting");
	console.log("erMsg", erMsg);
	console.log("code", code);
	console.log("something", something);
	connectToDiscord();
});

/**
 * @param {{ user: any; userID?: string; channelID?: string; message?: string; event?: import("discord.js").Message; moduleName: any; command: any; }} payload
 * @param {import("discord.js").TextChannel | import("discord.js").DMChannel | import("discord.js").GroupDMChannel} channel
 */
function HandleBotCommand(payload, channel) {
	if (payload.moduleName == "allgifs") {
		channel.send("Here you go " + payload.user + " these are all my gifs for " + payload.command + " http://gifs.kitten.academy/tags.html?tag=" + payload.command);
	}
	else if (payload.moduleName == "livestreams") {
		let url = "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UC83RKJs4eKHVE9v0YUyqzgg&eventType=live&maxResults=10&order=viewCount&type=video&key=" + setting("GooleAPIKey")
		https.get(url, (res) => {
			var body = '';

			res.on('data', function (chunk) {
				body += chunk;
			});

			res.on('end', function () {
				let result = JSON.parse(body);
				console.log("Got a response: ", result);
				let retval = "Here are the current streams \n"
				for (let i = 0; i < result.items.length; i++) {
					retval += `${result.items[i].snippet.title}: https://www.youtube.com/watch?v=${result.items[i].id.videoId}\n`;
				}
				channel.send(retval);
			});
		}).on('error', function (e) {
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
		findfile(payload.command,
			/**
			 * @param {{ name: string; path: string; }} file
			 */
			file => {
				if (!file) {
					channel.send("Sorry " + payload.user + " I dunno lol ¯\\_(ツ)_/¯");
					return;
				}
				channel.send("Here you go " + payload.user + " I found " + file.name + ": " + file.path);
			}, true, "image");
	}
	else if (payload.moduleName == "gif") {
		findfile(payload.command,
			/**
			 * @param {{ name: any; path: string; }} file
			 */
			file => {
				if (!file) {
					channel.send("Sorry " + payload.user + " I dunno lol ¯\\_(ツ)_/¯");
					return;
				}
				const embed = new Discord.RichEmbed()
					.setTitle(file.name)
					.setColor(0xBADA55)
					.setDescription("Here you go " + payload.user + " I found a gif for you")
					.setImage(file.path)
					.setTimestamp()
					.setURL(file.path)
				channel.send({ embed });
			}, true, "gif");
	}
}
