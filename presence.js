module.exports = (bot, name = "son jardin", status = "online") => {
	bot.user.setPresence({
		activity: {
			name: name
		},
		status: status
	});
};