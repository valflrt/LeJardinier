const { Random, RandomItem, FormatDateFromMs } = require("./utils/toolbox");
const fetch = require("node-fetch");
const settings = require("./config.json");
const { db, addServer, addMember, setSeed, getTimeleft, buyItem, getInventaire } = require("./db");
const { Collection } = require("./utils/collection");

let commands = new Collection();

/*-----------------------------------*/

commands.addCategoryName("Commandes d'aide");

// help command

commands.addCommand("help", "Donne la liste des commandes disponibles.", (requirements) => {

	let { message } = requirements;

	message.reply(`Voici une liste des commandes disponibles ${RandomItem([":grin:", ":partying_face:", ":thumbsup:"])}\n\`\`\`${commands.toList()}\`\`\``);

});

// gives a link to invite this bot to one of your guild

commands.addCommand("inviter", "Inviter ce bot sur un autre serveur.", (requirements) => {

	let { message, bot } = requirements;

	bot.generateInvite(['SEND_MESSAGES', 'MANAGE_GUILD', 'MENTION_EVERYONE'])
		.then(link => {
			message.reply(`Voici mon lien d'invitation ${RandomItem([":grin:", ":partying_face:", ":thumbsup:"])} :\n${link}\n*Mais attention, je suis en developpement...*`);
		});

});

/*-----------------------------------*/

commands.addCategoryName("Commandes basiques");

// test command (checks if the bot is working correctly)

commands.addCommand("ping", "Commande de test.", (requirements) => {

	let { message } = requirements;

	message.reply(`Pong :ping_pong: !`);

});

// told "hello" to the bot and gives you an answer

commands.addCommand("hey", "Dire bonjour au bot.", (requirements) => {

	let { message } = requirements;

	message.reply(`${RandomItem(["Salut", "Coucou", "Hey"])} **${message.author.username}** ! ${RandomItem([":grin:", ":partying_face:", ":thumbsup:"])}`);

});

// makes the bot repeating <argument>

commands.addCommand("repete", "Faire répèter <argument> au bot.", (requirements) => {

	let { message, args } = requirements;

	message.reply("" + args.join(" "));

});

// makes the bot playing to <argument>

commands.addCommand("joue", "Faire jouer le bot à <argument>.", (requirements) => {

	let { message, args, bot } = requirements;

	message.reply(`Comme tu veux ${RandomItem([":ok_hand:", ":thumbsup:"])}`);
	bot.user.setPresence({ activity: { name: args.join(" ") } });
	setTimeout(() => {
		bot.user.setPresence(settings.activity);
	}, 20000);

});

/*-----------------------------------*/

commands.addCategoryName("Commandes d'administration");

commands.addCommand("kick", "Kicker le membre mentionné dans <argument1> et règle la raison avec <argument2>.", (requirements) => {

	let { message, args } = requirements;

	if (message.member.hasPermission('KICK_MEMBERS') === true) {

		let toKick = message.mentions.users.first();

		if (toKick || message.mentions.users.keyArray().length > 1) {

			args.shift();

			message.guild.members.cache.get(toKick.id).send(`${toKick}, tu as été kické du serveur **${message.guild}** par **${message.author.username}**...\nRaison: ${args}`)
				.then(() => {
					message.guild.members.cache.get(toKick.id).kick();
					message.reply(`fait !\nJ'espère que tu sais ce que tu fais...`);
				})
				.catch(err => {
					message.reply(`erreur !\nIl y a eu un bug lors du kickage de <@${toKick.id}> :bug:`);
				});

		} else {
			message.reply(`tu n'as pas mentionné de membre (ou trop)... ça ne risque pas de marcher !`);
		};

	} else {
		message.reply(`tu ne possède pas la permission de kicker des membres...`);
	};

});

commands.addCommand("ban", "Banni le membre mentionné dans <argument1> et règle la raison avec <argument2>.", (requirements) => {

	let { message, args } = requirements;

	if (message.member.hasPermission('BAN_MEMBERS') === true) {

		let toBan = message.mentions.users.first();

		if (toBan || message.mentions.users.keyArray().length > 1) {

			args.shift();

			message.guild.members.cache.get(toBan.id).send(`${toBan}, tu as été banni du serveur **${message.guild}** par **${message.author.username}**...\nRaison: ${args}`)
				.then(() => {
					message.guild.members.cache.get(toBan.id).ban();
					message.reply(`fait !\nJ'espère que tu sais ce que tu fais...`);
				})
				.catch(err => {
					message.reply(`erreur !\nIl y a eu un bug lors du kickage de <@${toBan.id}> :bug:`);
				});

		} else {
			message.reply(`tu n'as pas mentionné de membre (ou trop)... ça ne risque pas de marcher !`);
		};

	} else {
		message.reply(`tu ne possède pas la permission de kicker des membres...`);
	};

});

/*-----------------------------------*/

commands.addCategoryName("Commandes d'information");

// get information about yourself

commands.addCommand("moi", "Obtenir des informations sur vous.", (requirements) => {

	let { message } = requirements;

	let ms = message.guild.members.cache.find(member => member.id).joinedTimestamp;

	message.reply(`voici quelques informations à propos de **${message.author.username}** ${RandomItem([":yum:", ":partying_face:", ":thumbsup:"])}\n\`\`\`Nom d'utilisateur: ${message.author.username}\nNuméro d'identification: ${message.author.id}\nMembre depuis: ${FormatDateFromMs(ms)}\`\`\``);

});

// get information about this guild

commands.addCommand("serveur", "Obtenir des informations sur ce serveur.", (requirements) => {

	let { message } = requirements;

	message.reply(`voici quelques informations à propos de **${message.guild.name}** ${RandomItem([":yum:", ":partying_face:"])}\n\`\`\`Nom du serveur: ${message.guild.name}\nNuméro d'identification: ${message.guild.id}\nNombre de membres: ${message.guild.memberCount}\nCréé le: ${FormatDateFromMs(message.guild.createdTimestamp)}\`\`\``);

});

// get somebody's avatar

commands.addCommand("avatar", "Obtenir l'avatar de la personne mentionnée en <argument>.", (requirements) => {

	let { message } = requirements;

	// checks if there is a mention in the message

	if (message.mentions.length === 0) {
		message.reply(`voici l'avatar de **${message.author.username}** ${RandomItem([":grin:", ":partying_face:"])}`, { files: [message.author.displayAvatarURL()] });
	} else {
		message.reply(`voici l'avatar de **${message.mentions.members.first().user.username}** ${RandomItem([":grin:", ":partying_face:"])}`, { files: [message.mentions.members.first().user.displayAvatarURL()] });
	};

});

// gives weather

commands.addCommand("meteo", "Le bot donne la météo pour la ville de <argument>.", (requirements) => {

	let { message, args } = requirements;

	url = `https://api.openweathermap.org/data/2.5/weather?q=${args.join("+")}&appid=90c2de24c1a8f38d24475038e42da54a&lang=fr&units=metric`;

	// fetchs the api response to display weather

	fetch(url)
		.then(response => response.json())
		.then(response => {
			message.reply(`voici la météo dans la ville de **${args.join(" ")}** :partying_face:\n\`\`\`Description: ${response.weather[0].description}\nTempérature: ${response.main.temp}°C\nTempérature ressentie: ${~~response.main.feels_like}°C\nHumidité: ${response.main.humidity}%\nVitesse du vent: ${response.wind.speed}Km/h\nSens du vent: ${response.wind.deg}°\`\`\``);
		})
		.catch((err) => {
			message.reply(`oups, il y a eu un problème lors de la recherche de la météo :confounded:\nPeut-être que tu as mal écris le nom de la ville ou qu'elle n'existe pas.\n*Mais c'est peut-être moi qui n'ai pas fonctionné cette fois ci...*`);
		});

});

/*-----------------------------------*/

commands.addCategoryName("Commandes de divertissement");

// gives a random rate of <argument>

commands.addCommand("taux", "Taux aléatoire de <argument>.", (requirements) => {

	let { message, args } = requirements;

	message.reply(`**${message.author.username}** a un taux de ${args.join(" ") || "quelque chose"} de ${Random(0, 100)}%...`);

});

// gives true or false randomly

commands.addCommand("vraioufaux", "Vrai ou faux <argument>.", (requirements) => {

	let { message, args, bot } = requirements;

	message.reply(`**${message.author.username}**: ${args.join(" ") || "rien"}\n**${bot.user.username}**: ${RandomItem(["Vrai", "Faux"])} !`);

});

module.exports = commands;
