/**
 * entirely written by valflrt with almost no copy-paste :)
 * https://github.com/valflrt
 */

// required modules

const { Client } = require("discord.js");
require("colors");

// local modules

const commands = require("./commands");
const config = require("./config.json");
const { token } = require("./token.json");
const { db, updateDB } = require("./db");
const troll = require("./troll");

const bot = new Client();

bot.on("ready", () => {

	// verifications and console logging

	console.log("\033c");
	console.log("Loading...");

	(async () => {
		console.log("\033c");
		await bot.user.setUsername(config.username);
		console.log(` ${"[+]".green} Username set`);

		await bot.user.setPresence({
			activity: {
				name: config.activity.name
			},
			status: config.activity.status
		});
		console.log(` ${"[+]".green} Presence set`);

		await db.write();
		console.log(` ${"[+]".green} Database ready`);

		console.log(` ${"[+]".green} Logged in as: ${(bot.user.tag).cyan} - (${(bot.user.id).cyan})\n`);
		console.log(" " + " connected ".bgGreen.black + "\n");
	})();

});

bot.on("message", async (message) => {

	message.reply = (str, files) => message.channel.send(`${message.author}\n${str}`, files || {});

	// logs every message with its author's username

	console.log(`${(message.author.tag).blue.bold}: ${message.content}`);

	// skip if the message comes from the bot

	if (message.author.bot === true) {
		return;
	} else if (message.channel.type === "dm") {

		// if the message is from a dm channel, the bot answer that it works only in server channels

		message.channel.send("Désolé je ne fonctionne que dans les serveurs :confounded:");
		return;

	};

	// update database

	await updateDB(message.guild.id, message.author.id)
		.then(user => {

			// detect if the user leveled up

			if (user.lvlUp === true) {
				commands.execute("levelup", { message, user }, true); // "true" tells to execute even if it's an "hidden command"
			};
		})
		.catch(err => console.log(err));

	// detect prefix and command and execute the command

	if (message.content.startsWith(config.prefix)) {

		let content = message.content.replace(config.prefix, "").split(" ");
		let commandName = content.shift();
		let args = content;

		// check if the command exists and execute it

		if (commands.exists(commandName) === true) {
			commands.execute(commandName, { message, args, bot }); // object allow you to pass custom variables (look at commands.js)
		} else {
			message.reply("Cette commande n'existe pas !");
		};

	};

	// troll function

	troll.listen(message);

	if (message.content === "testimage") {
		require("./image")(message);
	};

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

bot.login(token);
