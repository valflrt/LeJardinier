const Canvas = require("canvas");
const fetch = require("node-fetch");
const discord = require("discord.js");

const { Random, RandomItem, FormatDateFromMs } = require("./utils/toolbox");
const { Collection } = require("./utils/collection");
const { getStats } = require("./db");
const settings = require("./config.json");
const Message = require("./message");
const emotes = require("./emotes");

// create command collection

let commands = new Collection();

// help commands

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

commands.addCommand("invitation", "Inviter ce bot sur un autre serveur.", (requirements) => {

	let { message, bot } = requirements;

	bot.generateInvite(['SEND_MESSAGES', 'MANAGE_GUILD', 'MENTION_EVERYONE'])
		.then(link => {
			message.reply(
				new Message()
					.setMain(`Voici mon lien d'invitation ${emotes.success()}\n*Mais attention, je suis en developpement...*\n${link}`)
					.end()
			);
		});

});

// basical commands

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
			.setMain(`${RandomItem(["Salut", "Coucou", "Hey"])} ${message.author} ! ${emotes.success()}`)
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
			.setMain(`Comme tu veux ${emotes.success()}`)
			.end()
	);

	bot.user.setPresence({ activity: { name: args.join(" ") } });

	setTimeout(() => {
		bot.user.setPresence(settings.activity);
	}, 20000);

});

// administration commands

commands.addCategoryName("Commandes d'administration");

commands.addCommand("kick", "Kicker le membre mentionné dans <argument1> et règle la raison avec <argument2>.", (requirements) => {

	let { message, args } = requirements;

	if (message.member.hasPermission('KICK_MEMBERS') === true) {

		let toKick = message.mentions.users.first();

		if (!toKick || message.mentions.users.keyArray().length > 1) {

			message.reply(
				new Message()
					.setMain(`Tu n'as pas mentionné de membre (ou trop)... ça ne risque pas de marcher !`)
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
									.setMain(`Fait !\nJ'espère que tu sais ce que tu fais...`)
									.end()
							);
						})
						.catch(() => {
							message.reply(
								new Message()
									.setMain(`Erreur !\nCe membre n'est sûrrement pas kickable...`)
									.end()
							);
						});
				});

		};

	} else {
		message.reply(
			new Message()
				.setMain(`Tu ne possède pas la permission de kicker des membres...`)
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
					.setMain(`Tu n'as pas mentionné de membre (ou trop)... ça ne risque pas de marcher !`)
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
							.setMain(`Fait !\nJ'espère que tu sais ce que tu fais...`)
							.end()
					);
				})
				.catch(err => {
					message.reply(
						new Message()
							.setMain(`Erreur !\nCe membre ne doit sûrrement pas pouvoir être banni...`)
							.end()
					);
				});

		};

	} else {
		message.reply(
			new Message()
				.setMain(`Tu ne possède pas la permission de kicker des membres...`)
				.end()
		);
	};

});

// information commands

commands.addCategoryName("Commandes d'information");

// get your profile

commands.addCommand("profil", "Afficher votre profil.", (requirements) => {

	let { message } = requirements;

	let stats = getStats(message.guild.id, message.author.id);

	(async () => {
		const canvas = Canvas.createCanvas(700, 250);
		const ctx = canvas.getContext('2d');

		let basex = 200;

		// display username

		fontSize = 60;

		do {
			ctx.font = `bold ${fontSize -= 5}px \"Whitney Book\"`;
		} while (basex + ctx.measureText(message.author.tag).width > canvas.width);

		ctx.fillStyle = "#ffffff";
		ctx.fillText(message.author.username, basex, 115);
		ctx.fillStyle = "#878787";
		ctx.fillText("#" + message.author.discriminator, ctx.measureText(message.author.username).width + basex, 114);

		// display level

		ctx.fillStyle = "#ffffff";
		ctx.font = "bold 28px \"Whitney Book\"";
		ctx.fillText(`Level ${stats.lvl}`, basex, 149);

		// main values to draw the line graph

		let lineStart = basex + 6;
		let lineEnd = lineStart + 300;
		let lineLength = Math.abs(lineStart - lineEnd)
		let lineTop = 160;
		let lineBottom = 176;
		let lineMiddle = Math.round((lineTop + lineBottom) / 2);
		let radius = Math.abs(lineTop - lineBottom) / 2;

		// display xp

		ctx.font = "bold 24px \"Whitney Book\"";
		ctx.fillText(`${stats.xp}/${stats.xpMax}`, lineEnd + 20, 175);

		// display xp line graph bg

		ctx.beginPath();
		ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
		ctx.lineTo(lineStart, lineTop);
		ctx.lineTo(lineEnd, lineTop);
		ctx.arc(lineEnd, lineMiddle, radius, 0, Math.PI * 2, false);
		ctx.lineTo(lineEnd, lineBottom);
		ctx.lineTo(lineStart, lineBottom);
		ctx.arc(lineStart, lineMiddle, radius, 0, Math.PI * 2, true);
		ctx.fill();
		ctx.closePath();

		// display xp line graph

		let xpEnd = (stats.xp / stats.xpMax * lineLength) + lineStart;

		ctx.beginPath();
		ctx.fillStyle = "#4CE821";
		ctx.lineTo(lineStart, lineTop);
		ctx.lineTo(xpEnd, lineTop)
		ctx.arc(xpEnd, lineMiddle, radius, 0, Math.PI * 2, false);
		ctx.lineTo(xpEnd, lineBottom);
		ctx.lineTo(lineStart, lineBottom);
		ctx.arc(lineStart, lineMiddle, radius, 0, Math.PI * 2, true);
		ctx.fill();
		ctx.closePath();

		// crop around avatar image

		ctx.beginPath();
		ctx.arc(115, 125, 50, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();

		const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: 'jpg' }));

		ctx.drawImage(avatar, 65, 75, 165, 175);

		const attachment = new discord.MessageAttachment(canvas.toBuffer(), 'unknown.png');

		message.reply(
			new Message()
				.setMain(`Voici ton profil ${message.author} ${emotes.success()}`)
				.end()
			, attachment
		);

	})();

});

// get information about this guild

commands.addCommand("serveur", "Obtenir des informations sur ce serveur.", (requirements) => {

	let { message } = requirements;

	message.reply(
		new Message()
			.setMain(`Voici le profil de **${message.guild}** ${emotes.success()}`)
			.setDescription(`##Nom du serveur: ${message.guild.name}\nNuméro d'identification: ${message.guild.id}\nNombre de membres: ${message.guild.memberCount}\nCréé le: ${FormatDateFromMs(message.guild.createdTimestamp)}##`)
			.end()
	);

});

// get somebody's avatar

commands.addCommand("pdp", "Obtenir la photo de profil de la personne mentionnée en <argument>.", (requirements) => {

	let { message } = requirements;

	// checks if there is a mention in the message

	if (!message.mentions.users.first()) {
		message.reply(
			new Message()
				.setMain(`Voici la photo de profil de ${message.author} ${emotes.success()}`)
				.end(),
			{ files: [message.author.displayAvatarURL()] }
		);
	} else {
		message.reply(
			`voici l'avatar de **${message.mentions.users.first().user.username}** ${emotes.success()}`
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
					.setMain(`Voici la météo dans la ville de **${response.name}** ${emotes.success()}`)
					.setDescription(`##Description: ${response.weather[0].description}\nTempérature: ${response.main.temp}°C\nTempérature ressentie: ${~~response.main.feels_like}°C\nHumidité: ${response.main.humidity}%\nVitesse du vent: ${response.wind.speed}Km/h\nSens du vent: ${response.wind.deg}°##`)
					.end()
			);
		})
		.catch((err) => {
			message.reply(
				new Message()
					.setMain(`Oups, problème apparait ${emotes.fail()}\nSoit tu as mal écrit sois la ville n'existe pas...\n*Mais il y a peut être eu un bug...*`)
					.end()
			);
		});

});

// entertainement commands

commands.addCategoryName("Commandes de divertissement");

// gives a random rate of <argument>

commands.addCommand("taux", "Taux aléatoire de <argument>.", (requirements) => {

	let { message, args } = requirements;

	message.reply(
		new Message()
			.setMain(`${message.author} a un taux de ${args.join(" ") || "quelque chose"} de ${Random(0, 100)}%...`)
			.end()
	);

});

// gives true or false randomly

commands.addCommand("vraioufaux", "Vrai ou faux <argument>.", (requirements) => {

	let { message, args, bot } = requirements;

	message.reply(
		new Message()
			.setMain(`${message.author}: ${args.join(" ") || "rien"}\n ** ${bot.user.username} **: ${RandomItem(["vrai", "faux"])} !`)
			.end()
	);

});

// action commands

commands.addCategoryName("Commandes d'action");

// makes you staring at somebody

commands.addCommand("regarder", "Regarder <argument>.", (requirements) => {

	let { message } = requirements;

	let image = RandomItem(["https://tenor.com/view/pissed-stare-gif-12898273", "https://tenor.com/view/seriously-side-eye-confused-gif-8776030"]);

	message.reply(
		new Message()
			.setMain(`${message.author} regarde **${message.mentions.users.first()}** !`)
			.end()
	).then(() => message.channel.send(image));

});

// hidden commands

commands.addHiddenCommand("levelup", (requirements) => {

	let { message, user } = requirements;

	message.reply(
		new Message()
			.setMain(`Bravo ${message.author}, tu es maintenant au niveau ${user.lvl} ${emotes.success()}`)
			.end()
	);

});

module.exports = commands;