var Discord = require('discord.io');
var setting = require('../settings.js')

var bot = new Discord.Client({
    token: setting('DiscordToken'),
    autorun: true
});
//console.log('bot', bot);
setTimeout(function(){
    bot.getMessage({channelID: '213201382491029504', messageID: '228560514295398400'}, function(resp){
    console.log('foundmessage', resp); 
}) 
}, 2000);



bot.on('ready', function() {
 //   console.log(bot.username + " - (" + bot.id + ")", "ready");
});
bot.on("any", function(event) {
//	console.log(event); //Logs every event
	var example = { t: 'MESSAGE_DELETE',
        s: 4,
        op: 0,
        d: { id: '228560514295398400', channel_id: '213201382491029504' } 
	}
});
bot.on('message', function(user, userID, channelID, message, event) {
    try {
    if (event.d.author.bot) {return;}
    var payload = {user: user, userID: userID, channelID: channelID, message: message, event: event};
    if (message[0] == "!"){
        HandleBotCommand(payload);
    } else {
        //CheckForOffensiveMessage(payload);
    }}
    catch (ex) {
        console.log('discordmessageexception',ex)
    }
});

function HandleBotCommand(payload){
    bot.deleteMessage({
        channelID: payload.channelID,
        messageID: payload.event.d.id
    }, function (retval){
        if (retval){ //coouldn't delete message PANIC!
            console.error('ERROR WHEN TRYING TO DELETE MESSAGE', retval);
        }
    });
    var moduleName = payload.message.split(" ")[0].replace("!", "");
    try {
        LoadModule(moduleName, payload);
    }
    catch (err){
        console.warn("Attempted to load " + moduleName + " failed");
        console.warn(err);
    }
}

function LoadModule(moduleName, payload){
    var module = require("./server/modules/"+moduleName+"/"+moduleName+".js");
    module(payload, function(message){
        var to = payload.channelID;
        var messageToSend = "";
        var isDM = false;
        if (typeof message === 'string'){
            messageToSend = message;
        } else {
            messageToSend = message.messageToSend;
            if (message.dm) {
                isDM = true;
                to = payload.userID;
            }
        }
        if (!isDM) {
            messageToSend = "Here's your " + moduleName + " " + payload.user + ": " +messageToSend;
        }
        bot.sendMessage({
                to: to,
                message: messageToSend
        });
    });
}

