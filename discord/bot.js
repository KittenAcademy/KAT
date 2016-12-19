var Discord = require('discord.io');
var setting = require('../settings.js');
var findfile = require('../drive/findfile.js');

var bot = new Discord.Client({
    token: setting('DiscordToken'),
    autorun: true
});

var avatar = require('./avatar.js')

bot.on('ready', function() {
    console.log(bot.username + " - (" + bot.id + ")", "ready");
    bot.editUserInfo({
        avatar: avatar, //Optional
        email: 'madelk@gmail.com' //Optional
            //new_password: 'supersecretpass123', //Optional
            //password: 'supersecretpass', //Required
            //username: 'Yuna' //Optional
    });
});
bot.on('message', function(user, userID, channelID, message, event) {
    try {
        if (event.d.author.bot) {
            return;
        }
        if (message[0] != "!") {
            return;
        }
        var moduleName = message.split(" ")[0];
        var payload = {
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
        console.error('errorwithbotonmessage', ex)
    }
});
bot.on('disconnected', function() {
    console.log("Bot disconnected reconnecting");
    bot.connect();
});

function HandleBotCommand(payload) {
    if (payload.moduleName == "whosefault") {
        bot.sendMessage({
            to: payload.channelID,
            message: "It's DJ's fault. Don't listen to that liar Toonki!"
        });
    }
    else if (payload.moduleName == "gif") {
        findfile(payload.command, function(file) {
            if (!file){
                bot.sendMessage({
                    to: payload.channelID,
                    message: "Sorry " + payload.user + " I dunno lol ¯\\_(ツ)_/¯"
                });
                return;
            }
            bot.sendMessage({
                to: payload.channelID,
                message: "Here you go " + payload.user + " I found " + file.name + ": https://kagifs.herokuapp.com" + file.path
            });
        });
    }
}
