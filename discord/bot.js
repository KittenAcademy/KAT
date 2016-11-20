var Discord = require('discord.io');
var setting = require('../settings.js');
var findfile = require('../drive/findfile.js');

var bot = new Discord.Client({
    token: setting('DiscordToken'),
    autorun: true
});
bot.on('ready', function() {
   console.log(bot.username + " - (" + bot.id + ")", "ready");
});
bot.on('message', function(user, userID, channelID, message, event) {
    if (event.d.author.bot) {return;}
    if (message[0] == "!"){
        var payload = {
            user: user,
            userID: userID, 
            channelID: channelID, 
            message: message, 
            event: event,
            moduleName: message.split(" ")[0].replace("!", "").toLowerCase(),
            command: message.split(" ")[1]
        };
        HandleBotCommand(payload);
    } else {
        //CheckForOffensiveMessage(payload);
    }
});

function HandleBotCommand(payload){
    if (payload.moduleName == "gif"){
        findfile(payload.command, function(filename){
            bot.sendMessage({
                to: payload.channelID,
                message: "https://kagifs.herokuapp.com"+filename
            });
        });
    }
}