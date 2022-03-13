import Discord, { Intents } from "discord.js";
import { getURL } from "../cloudFront/cloudFront";
import { RenameGif } from "../database";
import setting from "../settings";
import findfile from "../drive/findfile";
import catfacts from "./module/catfacts";
import jokes from "./module/jokes";
import https from "https";
const client = new Discord.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const connectToDiscord = () => {
  const token = setting("DiscordToken");
  if (!token) throw new Error("No Discord Token");

  client.login(token);
};
connectToDiscord();

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
  event: Discord.Message<boolean>;
  moduleName: string;
  command: string;
}

client.on("message", function (event) {
  try {
    if (event.author.bot) {
      return;
    }
    if (event.content[0] != "!") {
      return;
    }
    const moduleName = event.content.split(" ")[0];
    const payload: payload = {
      author: event.author,
      user: event.author.username,
      userID: event.author.id,
      channelID: event.channel.id,
      message: event.content,
      event: event,
      moduleName: moduleName.replace("!", "").toLowerCase(),
      command: event.content.replace(moduleName, "").substring(1),
    };
    const allowlist = setting("CommandAllowlist") || ({} as any);
    if (
      payload.moduleName in allowlist &&
      !allowlist[payload.moduleName].includes(event.channel.id)
    ) {
      return;
    }
    HandleBotCommand(payload, event.channel);
  } catch (ex) {
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

const HandleBotCommand = async (
  payload: payload,
  channel: someKindOfChannel
) => {
  if (payload.moduleName == "allgifs") {
    channel.send(
      "Here you go " +
        payload.user +
        " these are all my gifs for " +
        payload.command +
        " http://gifs.kitten.academy/tags.html?tag=" +
        payload.command
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
          channel.send(retval);
        });
      })
      .on("error", function (e) {
        channel.send("Oh dear! " + e);
      });
  } else if (payload.moduleName == "joke") {
    const message = jokes();
    channel.send(message);
  } else if (payload.moduleName == "catfact") {
    const message = catfacts();
    channel.send(message);
  } else if (payload.moduleName == "whosefault") {
    channel.send("It's DJ's fault. Don't listen to that liar Toonki!");
  } else if (payload.moduleName == "gif") {
    const file = await findfile(payload.command);
    if (!file || !file.path) {
      channel.send("Sorry " + payload.user + " I dunno lol ¯\\_(ツ)_/¯");
      return;
    }
    try {
      const attachment = new Discord.MessageAttachment(file.path, file.name);
      const options: Discord.MessageOptions = {
        content: `I found \`${file.name}\` for you`,
        files: [attachment],
        reply: { messageReference: payload.author.id },
      };
      channel.send(options);
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
      channel.send({ embeds: [embed], files: [file.path] });
    }
  } else if (payload.moduleName == "oldgif") {
    const file = await findfile(payload.command);
    if (!file || !file.path) {
      channel.send("Sorry " + payload.user + " I dunno lol ¯\\_(ツ)_/¯");
      return;
    }
    const embed = new Discord.MessageEmbed()
      .setTitle(file.name)
      .setColor(0xbada55)
      .setDescription("Here you go " + payload.user + " I found a gif for you")
      .setImage(file.path)
      .setTimestamp()
      .setURL(file.path);
    channel.send({ embeds: [embed], files: [file.path] });
  } else if (payload.moduleName == "renamegif") {
    const [oldName, newName] = payload.command.split(" ");
    if (!(newName || "").endsWith(".gif")) {
      channel.send(
        "Usage: `!renamegif current_name.gif new_name.gif` or `!renamegif id new_name.gif`"
      );
      return;
    }
    const file = await RenameGif(oldName, newName);
    if (file && file.name) {
      channel.send(`<${getURL(file.id)}.gif> is now \`${file.name}\``);
      return;
    } else {
      channel.send(`Could not find \`${oldName}\` :(`);
    }
  }
};
