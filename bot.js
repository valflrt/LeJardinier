const discord = require("discord.js");
const { Client } = discord;
const commands = require("./commands");
const settings = require("./settings.json");
require("colors");

const bot = new Client();

bot.on("ready", () => {
	bot.user.setUsername(settings.username);
	bot.user.setPresence(settings.activity);

	console.log("\033c");
	console.log(`${"connected".bgGreen.black}\n\nlogged in as: ${(bot.user.tag).cyan} - (${(bot.user.id).cyan})\n`);
});

bot.on("message", (message) => {

	message.channel.stopTyping();

	console.log(`${message.author.tag}: ${message.content}`);

	if (message.author.bot) return;

	const msg = (message.content.charAt(0) === "!") ? message.content.substr(1, message.content.length) : null;

	let cmd, args;

	if (msg !== null) {
		decompMsg = msg.split(" ");
		cmd = decompMsg.shift().toLowerCase();
		args = decompMsg;
	} else {
		cmd = null;
		args = null;
	};

	let msgStats = {
		user: message.author,
		fullMessage: message.content,
		command: cmd,
		arguments: args
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
			message.react("💢")
				.then(message.react("💥"))
				.then(message.react("🤬"))
				.then(message.react("💣"))
				.then(message.react("☠"))
				.then(message.react("🤡"))
				.then(message.react("🔪"))
				.then(message.channel.send("Grrrr"));
		};
	});

	message.mentions.members.each(member => {
		if (member.user.id === bot.user.id) {
			message.channel.send("grrr :skull:");
		};
	});

});

bot.login(settings.token);