const { Random, RandomItem, FormatDateFromMs } = require("./utils/toolbox");
const fetch = require("node-fetch");
const settings = require("./config.json");
const { Collection } = require("./utils/collection");
const Message = require("./message");

let commands = new Collection();

/*-----------------------------------*/

commands.addCategoryName("Commandes d'aide");

// help command

commands.addCommand("help", "Donne la liste des commandes disponibles.", (requirements) => {

	let { message } = requirements;

	message.reply(
		new Message()
			.setMain(`Voici une liste des commandes disponibles ${RandomItem([":grin:", ":partying_face:", ":thumbsup:"])}`)
			.setDescription(`##${commands.toList()}##`)
			.end()
	);

});

// gives a link to invite this bot to one of your guild

commands.addCommand("inviter", "Inviter ce bot sur un autre serveur.", (requirements) => {

	let { message, bot } = requirements;

	bot.generateInvite(['SEND_MESSAGES', 'MANAGE_GUILD', 'MENTION_EVERYONE'])
		.then(link => {
			message.reply(
				new Message()
					.setMain(`Voici mon lien d'invitation ${RandomItem([":grin:", ":partying_face:", ":thumbsup:"])} :\n${link}\n*Mais attention, je suis en developpement...*`)
					.end()
			);
		});

});

/*-----------------------------------*/

commands.addCategoryName("Commandes basiques");

// test command (checks if the bot is working correctly)

commands.addCommand("ping", "Commande de test.", (requirements) => {

	let { message } = requirements;

	message.reply(
		new Message()
			.setMain(`Pong :ping_pong: !`)
			.end()
	);

});

// told "hello" to the bot and gives you an answer

commands.addCommand("hey", "Dire bonjour au bot.", (requirements) => {

	let { message } = requirements;

	message.reply(
		new Message()
			.setMain(`${RandomItem(["Salut", "Coucou", "Hey"])} **${message.author.username}** ! ${RandomItem([":grin:", ":partying_face:", ":thumbsup:"])}`)
			.end()
	);

});

// makes the bot repeating <argument>

commands.addCommand("repete", "Faire répèter <argument> au bot.", (requirements) => {

	let { message, args } = requirements;

	message.channel.send(
		new Message()
			.setMain("" + args.join(" "))
			.end()
	);

});

// makes the bot playing to <argument>

commands.addCommand("joue", "Faire jouer le bot à <argument>.", (requirements) => {

	let { message, args, bot } = requirements;

	message.reply(
		new Message()
			.setMain(`Comme tu veux ${RandomItem([":ok_hand:", ":thumbsup:"])}`)
			.end()
	);

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

		if (!toKick || message.mentions.users.keyArray().length > 1) {

			message.reply(
				new Message()
					.setMain(`tu n'as pas mentionné de membre (ou trop)... ça ne risque pas de marcher !`)
					.end()
			);

		} else {

			args.shift();

			toKick.send(
				new Message()
					.setMain(`${toKick}, tu as été kické(e) du serveur **${message.guild}** par **${message.author.username}**...`)
					.setDescription((args.length !== 0) ? `Raison: ${args.join()}` : null)
					.end()
			)
				.then(() => {
					message.guild.members.cache.get(toKick.id).kick()
						.then(() => {
							message.reply(
								new Message()
									.setMain(`fait !\nJ'espère que tu sais ce que tu fais...`)
									.end()
							);
						})
						.catch(() => {
							message.reply(
								new Message()
									.setMain(`erreur !\nTu ne possède sûrrement pas la permission de kicker ce membre...`)
									.end()
							);
						});
				});

		};

	} else {
		message.reply(
			new Message()
				.setMain(`tu ne possède pas la permission de kicker des membres...`)
				.end()
		);
	};

});

commands.addCommand("ban", "Banni le membre mentionné dans <argument1> et règle la raison avec <argument2>.", (requirements) => {

	let { message, args } = requirements;

	if (message.member.hasPermission('BAN_MEMBERS') === true) {

		let toBan = message.mentions.users.first();

		if (!toBan || message.mentions.users.keyArray().length > 1) {

			message.reply(
				new Message()
					.setMain(`tu n'as pas mentionné de membre (ou trop)... ça ne risque pas de marcher !`)
					.end()
			);

		} else {

			args.shift();

			toBan.send(
				new Message()
					.setMain(`${toKick}, tu as été banni(e) du serveur **${message.guild}** par **${message.author.username}**...`)
					.setDescription((args.length !== 0) ? `Raison: ${args.join()}` : null)
					.end()
			)
				.then(() => {
					message.guild.members.cache.get(toBan.id).ban();
					message.reply(
						new Message()
							.setMain(`fait !\nJ'espère que tu sais ce que tu fais...`)
							.end()
					);
				})
				.catch(err => {
					message.reply(
						new Message()
							.setMain(`erreur !\nTu ne possède sûrrement pas la permission de bannir ce membre...`)
							.end()
					);
				});

		};

	} else {
		message.reply(
			new Message()
				.setMain(`tu ne possède pas la permission de kicker des membres...`)
				.end()
		);
	};

});

/*-----------------------------------*/

commands.addCategoryName("Commandes d'information");

// get information about yourself

commands.addCommand("moi", "Obtenir des informations sur vous.", (requirements) => {

	let { message } = requirements;

	let ms = message.guild.members.cache.find(member => member.id).joinedTimestamp;

	message.reply(
		new Message()
			.setMain(`voici quelques informations à propos de **${message.author.username}** ${RandomItem([":yum:", ":partying_face:", ":thumbsup:"])}\n`)
			.setDescription(`##Nom d'utilisateur: ${message.author.username}\nNuméro d'identification: ${message.author.id}\nMembre depuis: ${FormatDateFromMs(ms)}##`)
			.end()
	);

});

// get information about this guild

commands.addCommand("serveur", "Obtenir des informations sur ce serveur.", (requirements) => {

	let { message } = requirements;

	message.reply(
		new Message()
			.setMain(`voici quelques informations à propos de **${message.guild.name}** ${RandomItem([":yum:", ":partying_face:"])}\n`)
			.setDescription(`##Nom du serveur: ${message.guild.name}\nNuméro d'identification: ${message.guild.id}\nNombre de membres: ${message.guild.memberCount}\nCréé le: ${FormatDateFromMs(message.guild.createdTimestamp)}##`)
			.end()
	);

});

// get somebody's avatar

commands.addCommand("avatar", "Obtenir l'avatar de la personne mentionnée en <argument>.", (requirements) => {

	let { message } = requirements;

	// checks if there is a mention in the message

	if (!message.mentions.users.first()) {
		message.reply(
			new Message()
				.setMain(`voici l'avatar de **${message.author.username}** ${RandomItem([":grin:", ":partying_face:"])}`)
				.end(),
			{ files: [message.author.displayAvatarURL()] }
		);
	} else {
		message.reply(
			`voici l'avatar de **${message.mentions.users.first().user.username}** ${RandomItem([":grin:", ":partying_face:"])}`
			,
			{ files: [message.mentions.users.first().user.displayAvatarURL()] }
		);
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
			message.reply(
				new Message()
					.setMain(`voici la météo dans la ville de **${response.name}** :partying_face:`)
					.setDescription(`##Description: ${response.weather[0].description}\nTempérature: ${response.main.temp}°C\nTempérature ressentie: ${~~response.main.feels_like}°C\nHumidité: ${response.main.humidity}%\nVitesse du vent: ${response.wind.speed}Km/h\nSens du vent: ${response.wind.deg}°##`)
					.end()
			);
		})
		.catch((err) => {
			message.reply(
				new Message()
					.setMain(`oups, il y a eu un problème lors de la recherche de la météo :confounded:\nPeut-être que tu as mal écris le nom de la ville ou qu'elle n'existe pas.\n*Mais c'est peut-être moi qui n'ai pas fonctionné cette fois ci...*`)
					.end()
			);
		});

});

/*-----------------------------------*/

commands.addCategoryName("Commandes de divertissement");

// gives a random rate of <argument>

commands.addCommand("taux", "Taux aléatoire de <argument>.", (requirements) => {

	let { message, args } = requirements;

	message.reply(
		new Message()
			.setMain(`**${message.author.username}** a un taux de ${args.join(" ") || "quelque chose"} de ${Random(0, 100)}%...`)
			.end()
	);

});

// gives true or false randomly

commands.addCommand("vraioufaux", "Vrai ou faux <argument>.", (requirements) => {

	let { message, args, bot } = requirements;

	message.reply(
		new Message()
			.setMain(`** ${message.author.username} **: ${args.join(" ") || "rien"}\n ** ${bot.user.username} **: ${RandomItem(["vrai", "faux"])} !`)
			.end()
	);

});

/*-----------------------------------*/

commands.addCategoryName("Commandes d'action");

// makes you staring at somebody

commands.addCommand("regarder", "Regarder <argument>.", (requirements) => {

	let { message } = requirements;

	let image = RandomItem(["https://tenor.com/view/pissed-stare-gif-12898273", "https://tenor.com/view/seriously-side-eye-confused-gif-8776030"]);

	message.reply(
		new Message()
			.setMain(`**${message.author.username}** regarde **${message.mentions.users.first()}** !`)
			.end()
	).then(() => message.channel.send(image));

});

module.exports = commands;
