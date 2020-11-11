const discord = require("discord.js");
const { Client } = discord;
const commands = require("./commands");
const setPresence = require("./presence");
const settings = require("./settings.json");

const bot = new Client();

bot.on("ready", () => {
	bot.user.setUsername(settings.username);
	console.log(`connected\nlogged in as: ${bot.user.tag} - (${bot.user.id})\n`);
	setPresence(bot, "son jardin");
});

bot.on("message", (message) => {

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

	console.log(`${message.author.tag}: ${message.content}`);

	commands.forEach((command) => {
		if (command.command === cmd) {
			command.execute(message, args, bot);
		};
	});

	if (message.include("ok") === true) {
		message.channel.send("Grrrr");
	};

});

bot.login(settings.token);