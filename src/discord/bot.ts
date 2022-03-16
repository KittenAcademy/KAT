import Discord, { Intents } from "discord.js";
import { getURL } from "../cloudFront/cloudFront";
import {
  BulkRenameGifs,
  DeleteGif,
  FindGif,
  FindGifsByNameRegex,
  RenameGif
} from "../database";
import setting from "../settings";
import findfile from "../drive/findfile";
import catfacts from "./module/catfacts";
import {
  generateGifsCsvAttachment,
  generateRenameGifsCsvAttachment,
  parseBulkRenameAttachment
} from "./csv";
import jokes from "./module/jokes";
import https from "https";
import { deleteFile } from "../s3/s3";
const client = new Discord.Client({
  restRequestTimeout: 60000,
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES
  ],
  partials: ["CHANNEL"]
});

export const connectToDiscord = async () => {
  const token = setting("DiscordToken");
  if (!token) throw new Error("No Discord Token");
  await client.login(token);
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
  attachments: Discord.MessageAttachment[];
}

client.on("messageCreate", async function (discordMessage) {
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
      command: discordMessage.content.replace(moduleName, "").substring(1),
      attachments: [...discordMessage.attachments.values()]
    };
    const allowlist = setting("CommandAllowlist") || ({} as any);
    if (
      payload.moduleName in allowlist &&
      !allowlist[payload.moduleName].includes(discordMessage.channel.id)
    ) {
      return;
    }
    await HandleBotCommand(payload, discordMessage.channel);
  } catch (ex) {
    console.error("errorwithbotonmessage", ex);
  }
});

client.on("ready", function (client) {
  console.log("discord client ready", client.user.username);
});
client.on("disconnect", async function (erMsg, code, something) {
  console.log("Bot disconnected reconnecting");
  console.log("erMsg", erMsg);
  console.log("code", code);
  console.log("something", something);
  await connectToDiscord();
});

const HandleBotCommand = async (
  payload: payload,
  channel: someKindOfChannel
) => {
  if (payload.moduleName == "allgifs") {
    await payload.discordMessage.reply(
      `Here you go ${payload.user} these are all my gifs for ${payload.command} http://gifs.kitten.academy/tags.html?tag=${payload.command}`
    );
  } else if (payload.moduleName == "livestreams") {
    const url =
      "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UC83RKJs4eKHVE9v0YUyqzgg&eventType=live&maxResults=10&order=viewCount&type=video&key=" +
      setting("GooleAPIKey");
    https
      .get(url, (res) => {
        let body = "";

        res.on("data", async function (chunk) {
          body += chunk;
        });

        res.on("end", async function () {
          const result = JSON.parse(body);
          console.log("Got a response: ", result);
          let retval = "Here are the current streams \n";
          for (let i = 0; i < result.items.length; i++) {
            retval += `${result.items[i].snippet.title}: https://www.youtube.com/watch?v=${result.items[i].id.videoId}\n`;
          }
          await payload.discordMessage.reply(retval);
        });
      })
      .on("error", async function (e) {
        await payload.discordMessage.reply("Oh dear! " + e);
      });
  } else if (payload.moduleName == "joke") {
    const message = jokes();
    await payload.discordMessage.reply(message);
  } else if (payload.moduleName == "catfact") {
    const message = catfacts();
    await payload.discordMessage.reply(message);
  } else if (payload.moduleName == "whosefault") {
    await payload.discordMessage.reply(
      "It's DJ's fault. Don't listen to that liar Toonki!"
    );
  } else if (payload.moduleName == "gif") {
    const file = await findfile(payload.command);
    if (!file || !file.path) {
      await payload.discordMessage.reply(
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
      await payload.discordMessage.reply(options);
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
      await payload.discordMessage.reply({
        embeds: [embed]
      });
    }
  } else if (payload.moduleName == "oldgif") {
    const file = await findfile(payload.command);
    if (!file || !file.path) {
      await payload.discordMessage.reply(
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
    await payload.discordMessage.reply({ embeds: [embed], files: [file.path] });
  } else if (payload.moduleName == "renamegif") {
    const [oldName, newName] = payload.command.split(" ");
    if (!(newName || "").endsWith(".gif")) {
      await payload.discordMessage.reply(
        "Usage: `!renamegif current_name.gif new_name.gif` or `!renamegif id new_name.gif`"
      );
      return;
    }
    const file = await RenameGif(oldName, newName);
    if (file && file.name) {
      await payload.discordMessage.reply(
        `<${getURL(file.id)}.gif> is now \`${file.name}\``
      );
      return;
    } else {
      await payload.discordMessage.reply(`Could not find \`${oldName}\` :(`);
    }
  } else if (payload.moduleName == "bulkrenamegifs") {
    const [search, replace] = payload.command.split(" ");
    if (search && replace && !payload.attachments.length) {
      const gifs = await FindGifsByNameRegex(search);
      if (!gifs.length) {
        await channel.send(`No gifs matched pattern \`${search}\``);
        return;
      }
      const renames = gifs
        .map((gif) => ({
          id: gif.id,
          oldName: gif.name,
          newName: gif.name.replace(new RegExp(search), replace)
        }))
        .filter((gif) => gif.oldName != gif.newName);
      if (!renames.length) {
        await channel.send(
          `Replace has no effect on any of the ${gifs.length} gif(s)`
        );
        return;
      }
      const file = generateRenameGifsCsvAttachment(renames);
      await channel.send({
        content: `Generated CSV to rename ${renames.length} gifs. Please check the contents and then upload this to rename them!`,
        files: [file]
      });
    } else if (!search && !replace && payload.attachments.length == 1) {
      try {
        const files = await parseBulkRenameAttachment(payload.attachments[0]);
        const result = await BulkRenameGifs(files);
        await channel.send(`Renamed ${result}/${files.length} gifs`);
      } catch (err) {
        if (typeof err === "string") {
          await channel.send(`Failed to process CSV: ${err}`);
        } else {
          throw err;
        }
      }
    } else {
      await channel.send(
        "Usage: `!bulkrenamegifs` and provide a three column CSV [id, old name, new name], OR `!bulkrenamegifs <search regex> <replace pattern>`"
      );
    }
  } else if (payload.moduleName == "bulkfindgifs") {
    if (payload.command.length == 0) {
      await channel.send(`Usage: !bulkfindgifs <regex>`);
      return;
    }
    const gifs = await FindGifsByNameRegex(payload.command);
    if (!gifs.length) {
      await channel.send(`No gifs found matching \`${payload.command}\``);
      return;
    }
    const attachment = generateGifsCsvAttachment(gifs);
    await channel.send({
      content: `Found ${gifs.length} gif(s) matching \`${payload.command}\``,
      files: [attachment]
    });
  } else if (payload.moduleName == "deletegif") {
    const id = payload.command;
    if (!id) {
      await payload.discordMessage.reply(
        "Usage: `!deletegif <id>` without .gif"
      );
      return;
    }
    const gif = await FindGif({ id });
    if (!gif) {
      await payload.discordMessage.reply(
        `Could not find gif with id \`${id}\``
      );
      return;
    }
    await DeleteGif(id);
    await deleteFile(id + ".gif");
    await payload.discordMessage.reply(
      `Gif \`${id}\` deleted. Hope you had a backup.`
    );
  }
};
