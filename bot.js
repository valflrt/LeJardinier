const discord = require("discord.js");
const { Client } = discord;
const commands = require("./commands");
const settings = require("./config.json");
const { RandomItem } = require("./utils/toolbox");
const { db } = require("./db");
require("colors");

const bot = new Client();

bot.on("ready", () => {

	// verifications and console log

	console.log("\033c");
	console.log("Loading...");

	(async () => {
		console.log("\033c");
		await bot.user.setUsername(settings.username);
		console.log(` ${"[+]".green} Username set`);
		await bot.user.setPresence(settings.activity);
		console.log(` ${"[+]".green} Presence set`);
		await db.write();
		console.log(` ${"[+]".green} Database ready`);

		console.log(` ${"[+]".green} Logged in as: ${(bot.user.tag).cyan} - (${(bot.user.id).cyan})\n`);
		console.log(" " + " connected ".bgGreen.black + "\n");
	})();

});

bot.on("message", (message) => {

	// logs every message

	console.log(`${(message.author.tag).blue.bold}: ${message.content}`);

	// skip if the message comes from the bot

	if (message.author.bot === true) {
		return;
	} else if (message.channel.type === "dm") {

		// if the message is from a dm channel, the bot answer that it works only in server channels

		message.channel.send("Désolé je ne fonctionne que dans les serveurs :confounded:");
		return;
	};

	// checks if the message starts with the command prefix

	const msg = (message.content.charAt(0) === settings.prefix) ? message.content.substr(1, message.content.length) : null;

	let name, args;

	if (msg !== null) {
		decompMsg = msg.split(" ");
		name = decompMsg.shift().toLowerCase();
		args = decompMsg;
	} else {
		cmd = null;
		args = null;
	};

	if (commands.exists(name) === true) {
		commands.execute(name, { message, args, bot });
	} else {
		message.reply(">>> Cette commande n'existe pas !")
	};

	// anti "ok" (for fun) the same structure can be used as a swear words filter

	message.content.split(" ").forEach(word => {
		if (word == "ok" || word == "Ok" || word == "oK" || word == "OK") {
			message.channel.send("Grrrr")
				.then(message.react("🤬"));
		};
	});

});

// sends message when there is a new guild member

bot.on('guildMemberAdd', member => {
	let logChannel = member.guild.channels.cache.find(channel => channel.name === "log");
	if (!logChannel) return;
	logChannel.send(`Bienvenue ${member.user.username} ${RandomItem([":partying_face:", ":thumbsup:", ":grin:"])}`);
});

// bot login

bot.login(settings.token);
