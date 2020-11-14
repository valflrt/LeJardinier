const Command = require("./utils/command");
const { Random, RandomItem, MsToHours } = require("./utils/toolbox");
const fetch = require("node-fetch");
const settings = require("./config.json");
const { db, addServer, addMember, updateSeeds, getTimeleft } = require("./database/db");

let commands = new Array();

/*-----------------------------------*/

commands.push(new Command("text", "\n- Commandes d'aide -\n")); // command name "text" make the command as a text part for displaying in the help command

/*-----------------------------------*/

commands.push(new Command("help", "Donne la liste des commandes disponibles.", (message, args, bot) => {

	let liste = new Array();

	commands.forEach((command) => {
		if (command.command === "text") {
			liste.push(command.description);
		} else {
			liste.push(`!${command.command} - ${command.description}`);
		};
	});

	message.channel.send(`>>> Voici une liste des commandes disponibles ${RandomItem([":grin:", ":partying_face:", ":thumbsup:"])}\n\`\`\`${liste.join("\n")}\`\`\``);

}));

/*-----------------------------------*/

commands.push(new Command("inviter", "Inviter ce bot sur un autre serveur.", (message, args, bot) => {
	bot.generateInvite(['SEND_MESSAGES', 'MANAGE_GUILD', 'MENTION_EVERYONE'])
		.then(link => {
			message.channel.send(`>>> Voici mon lien d'invitation ${RandomItem([":grin:", ":partying_face:", ":thumbsup:"])} :\n${link}\n*Mais attention, je suis en developpement...*`);
		});
}));

/*-----------------------------------*/

commands.push(new Command("text", "\n- Commandes basiques -\n"));

/*-----------------------------------*/

commands.push(new Command("ping", "Commande de test.", (message, args, bot) => {
	message.channel.send(`>>> Pong :ping_pong: !`);
}));

/*-----------------------------------*/

commands.push(new Command("hey", "Dire bonjour au bot.", (message, args, bot) => {
	message.channel.send(`>>> ${RandomItem(["Salut", "Coucou", "Hey"])} **${message.author.username}** ! ${RandomItem([":grin:", ":partying_face:", ":thumbsup:"])}`);
}));

/*-----------------------------------*/

commands.push(new Command("repete", "Faire répèter <argument> au bot.", (message, args, bot) => {
	message.channel.send(">>> " + args.join(" "));
}));

/*-----------------------------------*/

commands.push(new Command("joue", "Faire jouer le bot à <argument>.", (message, args, bot) => {
	message.channel.send(`>>> Comme tu veux ${RandomItem([":ok_hand:", ":thumbsup:"])}`);
	bot.user.setPresence({ activity: { name: args.join(" ") } });
	setTimeout(() => {
		bot.user.setPresence(settings.activity);
	}, 20000);
}));

/*-----------------------------------*/

commands.push(new Command("text", "\n- Commandes d'information -\n"));

/*-----------------------------------*/

commands.push(new Command("moi", "Obtenir des informations sur vous.", (message, args, bot) => {
	message.channel.send(`>>> Voici quelques informations à propos de **${message.author.username}** ${RandomItem([":yum:", ":partying_face:", ":thumbsup:"])}\n\`\`\`Nom d'utilisateur: ${message.author.username}\nNuméro d'identification: ${message.author.id}\nMembre depuis: ${message}\`\`\``);
}));

/*-----------------------------------*/

commands.push(new Command("serveur", "Obtenir des informations sur ce serveur.", (message, args, bot) => {
	message.channel.send(`>>> Voici quelques informations à propos de **ce serveur** ${RandomItem([":yum:", ":partying_face:"])}\n\`\`\`Nom du serveur: ${message.guild.name}\nNuméro d'identification: ${message.guild.id}\nNombre de membres: ${message.guild.memberCount}\`\`\``);
}));

/*-----------------------------------*/

commands.push(new Command("avatar", "Obtenir l'avatar de la personne mentionnée en <argument>.", (message, args, bot) => {

	if (args.length === 0) {
		message.channel.send(`>>> Voici l'avatar de **${message.author.username}** ${RandomItem([":grin:", ":partying_face:"])}`, { files: [message.author.displayAvatarURL()] });
	} else {
		message.channel.send(`>>> Voici l'avatar de **${message.mentions.members.first().user.username}** ${RandomItem([":grin:", ":partying_face:"])}`, { files: [message.mentions.members.first().user.displayAvatarURL()] });
	};

}));

/*-----------------------------------*/

commands.push(new Command("meteo", "Le bot donne la météo pour la ville de <argument>.", (message, args, bot) => {

	url = `https://api.openweathermap.org/data/2.5/weather?q=${args.join("+")}&appid=90c2de24c1a8f38d24475038e42da54a&lang=fr&units=metric`;

	fetch(url)
		.then(response => response.json())
		.then(response => {
			message.channel.send(`>>> Voici la météo dans la ville de **${args.join(" ")}** :partying_face:\n\`\`\`Description: ${response.weather[0].description}\nTempérature: ${response.main.temp}°C\nTempérature ressentie: ${~~response.main.feels_like}°C\nHumidité: ${response.main.humidity}%\nVitesse du vent: ${response.wind.speed}Km/h\nSens du vent: ${response.wind.deg}°\`\`\``);
		})
		.catch((err) => {
			message.channel.send(`Oups je ne peux pas trouver la météo pour cette ville... :confounded:`);
		});

}));

/*-----------------------------------*/

commands.push(new Command("text", "\n- Commandes de divertissement -\n"));

/*-----------------------------------*/

commands.push(new Command("taux", "Taux aléatoire de <argument>.", (message, args, bot) => {
	message.channel.send(`>>> **${message.author.username}** a un taux de ${args.join(" ") || "quelque chose"} de ${Random(0, 100)}%...`);
}));

/*-----------------------------------*/

commands.push(new Command("vraioufaux", "Vrai ou faux <argument>.", (message, args, bot) => {
	message.channel.send(`>>> **${message.author.username}**: ${args.join(" ") || "quelque chose"}\n**${bot.user.username}**: ${RandomItem(["Vrai", "Faux"])} !`);
}));

/*-----------------------------------*/

commands.push(new Command("recolter", "Récolter des graines du jardin.", (message, args, bot) => {

	if (!db.get("servers").find({ id: message.guild.id }).value()) {
		addServer(message.guild.id);
		console.log("server added");
	};

	let server = db.get("servers").find({ id: message.guild.id });

	if (!server.get("users").find({ id: message.author.id }).value()) {
		addMember(message.guild.id, message.author.id);
	};

	let seedAmount = Random(2, 6);

	if (getTimeleft(message.guild.id, message.author.id).timeReached === true) {
		updateSeeds(message.guild.id, message.author.id, seedAmount);
		message.channel.send(`>>> ${RandomItem(["Bravo", "Bien joué"])} **${message.author.username}**, tu as récolté **${seedAmount} graines** ${RandomItem([":partying_face:", ":thumbsup:", ":grin:"])} !`);
	} else {
		let { minutes, seconds } = getTimeleft(message.guild.id, message.author.id);
		message.channel.send(`>>> Désolé, il reste ${minutes}mn, ${seconds}s avant de pouvoir recolter des graines de nouveau :confounded:`);
	};
}));

/*-----------------------------------*/

commands.push(new Command("inventaire", "Montre votre inventaire.", (message, args, bot) => {

	let inventaire = db.get("servers")
		.find({ id: message.guild.id })
		.get("users")
		.find({ id: message.author.id })
		.value();

	message.channel.send(`>>> Voici ${RandomItem(["ton inventaire", "tes affaires"])} **${message.author.username}** ${RandomItem([":partying_face:", ":thumbsup:", ":ok_hand:"])}\n\`\`\`Graines: ${inventaire.seeds}\`\`\``);

}));

/*-----------------------------------*/

commands.push(new Command("acheter", "Montre les éléments du magasin, si un <argument> est donné achète l'élément correspondant.", (message, args, bot) => {

	let item = db.get("shop.items")
		.find({ name: args.join });

	message.channel.send(`>>> Voici ${RandomItem(["ton inventaire", "tes affaires"])} **${message.author.username}** ${RandomItem([":partying_face:", ":thumbsup:", ":ok_hand:"])}\n\`\`\`Graines: ${inventaire.seeds}\`\`\``);

}));

/*-----------------------------------*/

module.exports = commands;