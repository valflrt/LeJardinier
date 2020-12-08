iconst { Collection } = require("./utils/collection");
const { Random, RandomItem, MsToHours } = require("./utils/toolbox");
const fetch = require("node-fetch");
const settings = require("./config.json");
const { db, addServer, addMember, setSeed, getTimeleft, buyItem, getInventaire } = require("./db");

tlet collection = new Collection();

/*-----------------------------------*/

collection.addCategoryName("- Commandes d'aide -");

// help command

collection.addCommand("help", "Donne la liste des commandes disponibles.", (requirements) => {

	let { message } = requirements;

	message.reply(`>>> Voici une liste des commandes disponibles ${RandomItem([":grin:", ":partying_face:", ":thumbsup:"])}\n\`\`\`${collection.toList()}\`\`\``);

});

// gives a link to invite this bot to one of your guild

collection.addCommand("inviter", "Inviter ce bot sur un autre serveur.", (requirements) => {

	let { message, bot } = requirements;


	bot.generateInvite(['SEND_MESSAGES', 'MANAGE_GUILD', 'MENTION_EVERYONE'])
		.then(link => {
			message.reply(`>>> Voici mon lien d'invitation ${RandomItem([":grin:", ":partying_face:", ":thumbsup:"])} :\n${link}\n*Mais attention, je suis en developpement...*`);
		});

});

/*-----------------------------------*/

collection.addCategoryName("- Commandes basiques -");

// test command (checks if the bot is working correctly)

collection.addCommand("ping", "Commande de test.", (requirements) => {

	let { message } = requirements;

	message.reply(`>>> Pong :ping_pong: !`);

});

// told "hello" to the bot and gives you an answer

collection.addCommand("hey", "Dire bonjour au bot.", (requirements) => {

	let { message } = requirements;

	message.reply(`>>> ${RandomItem(["Salut", "Coucou", "Hey"])} **${message.author.username}** ! ${RandomItem([":grin:", ":partying_face:", ":thumbsup:"])}`);

});

// makes the bot repeating <argument>

collection.addCommand("repete", "Faire répèter <argument> au bot.", (requirements) => {

	let { message, args } = requirements;

	message.reply(">>> " + args.join(" "));

});

// makes the bot playing to <argument>

collection.addCommand("joue", "Faire jouer le bot à <argument>.", (requirements) => {

	let { message, args, bot } = requirements;

	message.reply(`>>> Comme tu veux ${RandomItem([":ok_hand:", ":thumbsup:"])}`);
	bot.user.setPresence({ activity: { name: args.join(" ") } });
	setTimeout(() => {
		bot.user.setPresence(settings.activity);
	}, 20000);

});

/*-----------------------------------*/

collection.addCategoryName("- Commandes d'information -");

// get information about yourself

collection.addCommand("moi", "Obtenir des informations sur vous.", (requirements) => {

	let { message } = requirements;

	message.reply(`>>> Voici quelques informations à propos de **${message.author.username}** ${RandomItem([":yum:", ":partying_face:", ":thumbsup:"])}\n\`\`\`Nom d'utilisateur: ${message.author.username}\nNuméro d'identification: ${message.author.id}\nMembre depuis: ${message}\`\`\``);

});

// get information about this guild

collection.addCommand("serveur", "Obtenir des informations sur ce serveur.", (requirements) => {

	let { message } = requirements;

	message.reply(`>>> Voici quelques informations à propos de **ce serveur** ${RandomItem([":yum:", ":partying_face:"])}\n\`\`\`Nom du serveur: ${message.guild.name}\nNuméro d'identification: ${message.guild.id}\nNombre de membres: ${message.guild.memberCount}\`\`\``);

});

// get somebody's avatar

collection.addCommand("avatar", "Obtenir l'avatar de la personne mentionnée en <argument>.", (requirements) => {

	let { message } = requirements;

	// checks if there is a mention in the message

	if (message.mentions.length === 0) {
		message.reply(`>>> Voici l'avatar de **${message.author.username}** ${RandomItem([":grin:", ":partying_face:"])}`, { files: [message.author.displayAvatarURL()] });
	} else {
		message.reply(`>>> Voici l'avatar de **${message.mentions.members.first().user.username}** ${RandomItem([":grin:", ":partying_face:"])}`, { files: [message.mentions.members.first().user.displayAvatarURL()] });
	};

});

// gives weather

collection.addCommand("meteo", "Le bot donne la météo pour la ville de <argument>.", (requirements) => {

	let { message, args } = requirements;

	url = `https://api.openweathermap.org/data/2.5/weather?q=${args.join("+")}&appid=90c2de24c1a8f38d24475038e42da54a&lang=fr&units=metric`;

	// fetchs the api response to display weather

	fetch(url)
		.then(response => response.json())
		.then(response => {
			message.reply(`>>> Voici la météo dans la ville de **${args.join(" ")}** :partying_face:\n\`\`\`Description: ${response.weather[0].description}\nTempérature: ${response.main.temp}°C\nTempérature ressentie: ${~~response.main.feels_like}°C\nHumidité: ${response.main.humidity}%\nVitesse du vent: ${response.wind.speed}Km/h\nSens du vent: ${response.wind.deg}°\`\`\``);
		})
		.catch((err) => {
			message.reply(`Oups, il y a eu un problème lors de la recherche de la météo :confounded:\nPeut-être que tu as mal écris le nom de la ville ou qu'elle n'existe pas.\n*Mais c'est peut-être moi qui n'ai pas fonctionné cette fois ci...*`);
		});

});

/*-----------------------------------*/

collection.addCategoryName("- Commandes de divertissement -");

// gives a random rate of <argument>

collection.addCommand("taux", "Taux aléatoire de <argument>.", (requirements) => {

	let { message, args } = requirements;

	message.reply(`>>> **${message.author.username}** a un taux de ${args.join(" ") || "quelque chose"} de ${Random(0, 100)}%...`);

});

// gives true or false randomly

collection.addCommand("vraioufaux", "Vrai ou faux <argument>.", (requirements) => {

	let { message, args, bot } = requirements;

	message.reply(`>>> **${message.author.username}**: ${args.join(" ") || "quelque chose"}\n**${bot.user.username}**: ${RandomItem(["Vrai", "Faux"])} !`);

});

// "havest" -> gives you seeds

collection.addCommand("recolter", "Récolter des graines du jardin.", (requirements) => {

	let { message } = requirements;

	// checks if the current server is saved in the db

	if (!db.get("servers").find({ id: message.guild.id }).value()) {
		addServer(message.guild.id);
		console.log("server added");
	};

	let server = db.get("servers").find({ id: message.guild.id });

	// checks if the current user is saved in the db

	if (!server.get("users").find({ id: message.author.id }).value()) {
		addMember(message.guild.id, message.author.id);
	};

	// generates a random seed amount (including the seed obtaining rate (buyable item))

	let seedAmount = Math.round(Random(2, 6) * db.get("servers").find({ id: message.guild.id }).get("users").find({ id: message.author.id }).get("obtainingRate").value());

	// checks if the time between two harvests is 1 hour

	if (getTimeleft(message.guild.id, message.author.id).timeReached === true) {
		setSeed(message.guild.id, message.author.id, seedAmount);
		message.reply(`>>> ${RandomItem(["Bravo", "Bien joué"])} **${message.author.username}**, tu as récolté **${seedAmount} graines** ${RandomItem([":partying_face:", ":thumbsup:", ":grin:"])} !`);
	} else {
		let { minutes, seconds } = getTimeleft(message.guild.id, message.author.id);
		message.reply(`>>> Désolé, il reste ${minutes}mn, ${seconds}s avant de pouvoir recolter des graines à nouveau :confounded:`);
	};
});

// gives you your inventaire

collection.addCommand("inventaire", "Montre votre inventaire.", (message, args, bot) => {

	if (getInventaire(message.guild.id, message.author.id, args.join(" ")) === null) {
		message.reply(`>>> Il faut d'abord utiliser la commande *!recolter* pour initialiser ton inventaire.`)
	} else {
		let inventaire = getInventaire(message.guild.id, message.author.id, args.join(" "));
		let formattedItems = () => {
			let byLineItems = inventaire.items.map(item => {
				return (item.name);
			});

			return byLineItems.join(", ");
		};
		message.reply(`>>> Voici ${RandomItem(["ton inventaire", "tes affaires"])} **${message.author.username}** ${RandomItem([":partying_face:", ":thumbsup:", ":ok_hand:"])}\n\`\`\`Graines: ${inventaire.seeds}\nItems: ${formattedItems()}\`\`\``);
	};

});

// used to buy an item in the shop

collection.addCommand("acheter", "Montre les éléments du magasin, si un <argument> est donné achète l'élément correspondant.", (message, args, bot) => {

	if (args.join(" ") === "") {
		let items = db.get("shop.items").value();

		let formattedItems = () => {
			let byLineItems = items.map(item => {
				if (item.name === "text") {
					return `\n${item.description}`;
				} else {
					return (`\n${item.name}: ${item.price} graines\n${item.description}`);
				};
			});

			return byLineItems.join("\n");
		};

		message.reply(`>>> Voici les items que tu peux acheter:\n\`\`\`${formattedItems()}\`\`\``);
	} else {
		buyItem(message.guild.id, message.author.id, args.join(" "))
			.then((item) => {
				message.reply(`>>> Tu as maintenant en ta possession \`${item.name}\` **${message.author.username}** ${RandomItem([":partying_face:", ":thumbsup:"])}`)
			})
			.catch(err => {
				message.reply(">>> " + err);
			});
	};

});

/*-----------------------------------*/

module.exports = collection;