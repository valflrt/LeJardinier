const discord = require("discord.js");
const { Client } = discord;
const commands = require("./commands");
const settings = require("./config.json");
const { RandomItem } = require("./utils/toolbox");
const { db } = require("./db");
const troll = require("./troll");
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

	// detect command prfix and answer

	if (message.content.startsWith(settings.prefix)) {

		let content = message.content.replace(settings.prefix, "").split(" ");
		let commandName = content.shift();
		let args = content;

		if (commands.exists(commandName) === true) {
			commands.execute(commandName, { message, args, bot });
		} else {
			message.reply("Cette commande n'existe pas !");
		};

	};

	// troll function

	troll.listen(message);

});

// sends message when there is a new guild member

bot.on('guildMemberAdd', member => {
	member.guild.channels.cache.find(channel => {
		if (channel.name == "logs") {
			channel.send(`Bienvenue ${member.user} ${RandomItem([":partying_face:", ":thumbsup:", ":grin:"])}`);
		};
	});
});

// bot login

bot.login(settings.token);
