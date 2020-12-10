let { RandomItem } = require("./utils/toolbox");

module.exports.listen = (message) => {

	// anti "ok"(for fun) the same structure can be used as a swear word filter

	if (message.content.match(/^.\s[oO][kK]\s.$|^[oO][kK]$/g) !== null) {
		message.react("🤬");
	};

	if (message.content.endsWith("non" || "non.")) {
		message.channel.send("bril");
	};

	if (message.content.endsWith("oui" || "oui.")) {
		message.channel.send("stiti");
	};

	if (message.content.endsWith("quoi" || "quoi?" || "quoi ?")) {
		message.channel.send("feur\n*Vas te coiffer tu me fait peur*");
	};

	if (message.author.id === "564012236851511298") {
		if (message.content === "je t'aime le bot") {
			message.channel.send(`Moi aussi maître ${message.author}, grand fabricant de bots de l'univers inexistant ${RandomItem([":smiling_face_with_3_hearts:", ":heart_eyes:"])}`);
		};
	} else if (message.author.id === "418813560739725312") {
		if (message.content === "je t'aime le bot") {
			message.channel.send(`Moi aussi maîtresse ${message.author}, grande detentrice de la thèse sur la trampolinutrition ${RandomItem([":smiling_face_with_3_hearts:", ":heart_eyes:"])}`);
		};
	} else if (message.content === "je t'aime le bot") {
		message.channel.send("Moi non sale humain :face_vomiting:");
	};
};