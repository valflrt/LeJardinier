const discord = require("discord.js");
const { Client } = discord;
const commands = require("./commands");
const settings = require("./settings.json");
const { RandomItem } = require("./utils/toolbox");
const { db } = require("./database/db");
require("colors");

const bot = new Client();

bot.on("ready", () => {

	console.log("\033c");
	console.log("Loading...");

	(async () => {
		console.log("\033c");
		await bot.user.setUsername(settings.username);
		console.log(` ${"[+]".green} Username setted`);
		await bot.user.setPresence(settings.activity);
		console.log(` ${"[+]".green} Presence set`);
		await db.write();
		console.log(` ${"[+]".green} Database ready`);

		console.log(` ${"[+]".green} Logged in as: ${(bot.user.tag).cyan} - (${(bot.user.id).cyan})\n`);
		console.log(" " + " connected ".bgGreen.black + "\n");
	})();

});

bot.on("message", (message) => {

	message.channel.stopTyping();

	console.log(`${(message.author.tag).blue.bold}: ${message.content}`);

	if (message.channel.type === "dm") {
		message.channel.send("Désolé je ne fonctionne que dans les salon de serveurs :confounded:");
		return;
	};

	const msg = (message.content.charAt(0) === settings.prefix) ? message.content.substr(1, message.content.length) : null;

	let cmd, args;

	if (msg !== null) {
		decompMsg = msg.split(" ");
		cmd = decompMsg.shift().toLowerCase();
		args = decompMsg;
	} else {
		cmd = null;
		args = null;
	};

	commands.forEach(async (command) => {
		if (command.command !== "text" && command.command === cmd) {
			message.channel.startTyping();
			await command.execute(message, args, bot);
			message.channel.stopTyping();
		};
	});

	message.content.split(" ").forEach(word => {
		if (word == "ok" || word == "Ok" || word == "oK" || word == "OK") {
			message.channel.send("Grrrr")
				.then(message.react("🤬"));
		};
	});

});

bot.on('guildMemberAdd', member => {
	let logChannel = member.guild.channels.cache.find(channel => channel.name === "log");
	if (!logChannel) return;
	logChannel.send(`Bienvenue ${member.username} ${RandomItem([":partying_face:", ":thumbsup:", ":grin:"])}`);
});

bot.login(settings.token);
