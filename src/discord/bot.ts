import Discord, { Intents } from "discord.js";
import { getURL } from "../cloudFront/cloudFront";
import { RenameGif } from "../database";
import setting from "../settings";
import findfile from "../drive/findfile";
import catfacts from "./module/catfacts";
import jokes from "./module/jokes";
import https from "https";
const client = new Discord.Client({
  restRequestTimeout: 60000,
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES
  ],
  partials: ["CHANNEL"]
});

export const connectToDiscord = () => {
  const token = setting("DiscordToken");
  if (!token) throw new Error("No Discord Token");
  client.login(token);
};

type someKindOfChannel =
  | Discord.DMChannel
  | Discord.PartialDMChannel
  | Discord.NewsChannel
  | Discord.TextChannel
  | Discord.ThreadChannel;
interface payload {
  author: Discord.User;
  user: string;
  userID: string;
  channelID: string;
  message: string;
  discordMessage: Discord.Message<boolean>;
  moduleName: string;
  command: string;
}

client.on("messageCreate", function (discordMessage) {
  try {
    if (discordMessage.author.bot) {
      return;
    }
    if (discordMessage.content[0] != "!") {
      return;
    }
    const moduleName = discordMessage.content.split(" ")[0];
    const payload: payload = {
      author: discordMessage.author,
      user: discordMessage.author.username,
      userID: discordMessage.author.id,
      channelID: discordMessage.channel.id,
      message: discordMessage.content,
      discordMessage,
      moduleName: moduleName.replace("!", "").toLowerCase(),
      command: discordMessage.content.replace(moduleName, "").substring(1)
    };
    const allowlist = setting("CommandAllowlist") || ({} as any);
    if (
      payload.moduleName in allowlist &&
      !allowlist[payload.moduleName].includes(discordMessage.channel.id)
    ) {
      return;
    }
    HandleBotCommand(payload, discordMessage.channel);
  } catch (ex) {
    console.error("errorwithbotonmessage", ex);
  }
});

client.on("ready", function (client) {
  console.log("discord client ready", client.user.username);
});
client.on("disconnect", function (erMsg, code, something) {
  console.log("Bot disconnected reconnecting");
  console.log("erMsg", erMsg);
  console.log("code", code);
  console.log("something", something);
  connectToDiscord();
});

const HandleBotCommand = async (
  payload: payload,
  channel: someKindOfChannel
) => {
  if (payload.moduleName == "allgifs") {
    payload.discordMessage.reply(
      `Here you go ${payload.user} these are all my gifs for ${payload.command} http://gifs.kitten.academy/tags.html?tag=${payload.command}`
    );
  } else if (payload.moduleName == "livestreams") {
    const url =
      "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UC83RKJs4eKHVE9v0YUyqzgg&eventType=live&maxResults=10&order=viewCount&type=video&key=" +
      setting("GooleAPIKey");
    https
      .get(url, (res) => {
        let body = "";

        res.on("data", function (chunk) {
          body += chunk;
        });

        res.on("end", function () {
          const result = JSON.parse(body);
          console.log("Got a response: ", result);
          let retval = "Here are the current streams \n";
          for (let i = 0; i < result.items.length; i++) {
            retval += `${result.items[i].snippet.title}: https://www.youtube.com/watch?v=${result.items[i].id.videoId}\n`;
          }
          payload.discordMessage.reply(retval);
        });
      })
      .on("error", function (e) {
        payload.discordMessage.reply("Oh dear! " + e);
      });
  } else if (payload.moduleName == "joke") {
    const message = jokes();
    payload.discordMessage.reply(message);
  } else if (payload.moduleName == "catfact") {
    const message = catfacts();
    payload.discordMessage.reply(message);
  } else if (payload.moduleName == "whosefault") {
    payload.discordMessage.reply(
      "It's DJ's fault. Don't listen to that liar Toonki!"
    );
  } else if (payload.moduleName == "gif") {
    const file = await findfile(payload.command);
    if (!file || !file.path) {
      payload.discordMessage.reply(
        "Sorry " + payload.user + " I dunno lol ¯\\_(ツ)_/¯"
      );
      return;
    }
    try {
      const attachment = new Discord.MessageAttachment(file.path, file.name);
      attachment.url = file.path;
      const options: Discord.MessageOptions = {
        content: `I found \`${file.name}\` for you`,
        files: [
          {
            attachment: file.path,
            name: file.name
          }
        ]
      };
      payload.discordMessage.reply(options);
    } catch (ex) {
      const embed = new Discord.MessageEmbed()
        .setTitle(file.name)
        .setColor(0xbada55)
        .setDescription(
          "Here you go " + payload.user + " I found a gif for you"
        )
        .setImage(file.path)
        .setTimestamp()
        .setURL(file.path);
      payload.discordMessage.reply({
        embeds: [embed],
        files: [file.path]
      });
    }
  } else if (payload.moduleName == "oldgif") {
    const file = await findfile(payload.command);
    if (!file || !file.path) {
      payload.discordMessage.reply(
        "Sorry " + payload.user + " I dunno lol ¯\\_(ツ)_/¯"
      );
      return;
    }
    const embed = new Discord.MessageEmbed()
      .setTitle(file.name)
      .setColor(0xbada55)
      .setDescription("Here you go " + payload.user + " I found a gif for you")
      .setImage(file.path)
      .setTimestamp()
      .setURL(file.path);
    payload.discordMessage.reply({ embeds: [embed], files: [file.path] });
  } else if (payload.moduleName == "renamegif") {
    const [oldName, newName] = payload.command.split(" ");
    if (!(newName || "").endsWith(".gif")) {
      payload.discordMessage.reply(
        "Usage: `!renamegif current_name.gif new_name.gif` or `!renamegif id new_name.gif`"
      );
      return;
    }
    const file = await RenameGif(oldName, newName);
    if (file && file.name) {
      payload.discordMessage.reply(
        `<${getURL(file.id)}.gif> is now \`${file.name}\``
      );
      return;
    } else {
      payload.discordMessage.reply(`Could not find \`${oldName}\` :(`);
    }
  }
};
