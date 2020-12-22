const Canvas = require("canvas");
const fetch = require("node-fetch");
const discord = require("discord.js");
const ytdl = require("ytdl-core");

const { Random, RandomItem, FormatDateFromMs } = require("./utils/toolbox");
const { Collection } = require("./utils/collection");
const { getStats, addSong, getSongs, shiftSong } = require("./db");
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
			.setDescription(`%%${commands.toList()}%%`)
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

		// frame

		ctx.beginPath();
		ctx.fillStyle = "rgba(20, 20, 20, 0.2)";
		ctx.lineTo(20, 0);
		ctx.lineTo(680, 0);
		ctx.arc(690, 10, 10, 0, Math.PI * 2, false);
		ctx.lineTo(700, 20);
		ctx.lineTo(700, 230);
		ctx.arc(690, 240, 10, 0, Math.PI * 2, true);
		ctx.lineTo(680, 250);
		ctx.lineTo(20, 250);
		ctx.arc(10, 240, 10, 0, Math.PI * 2, true);
		ctx.lineTo(0, 230);
		ctx.lineTo(0, 20);
		ctx.arc(10, 10, 10, 0, Math.PI * 2, true);
		ctx.fill();
		ctx.closePath();

		// main x coordinate for text

		let basex = 210;

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
		ctx.arc(120, 125, 50, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();

		const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: "jpg" }));

		ctx.drawImage(avatar, 60, 75); // just x and y to do not stretch the image

		const attachment = new discord.MessageAttachment(canvas.toBuffer(), "profil.png");

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
			.setDescription(`%%Nom du serveur: ${message.guild.name}\nNuméro d'identification: ${message.guild.id}\nNombre de membres: ${message.guild.memberCount}\nCréé le: ${FormatDateFromMs(message.guild.createdTimestamp)}%%`)
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
					.setDescription(`%%Description: ${response.weather[0].description}\nTempérature: ${response.main.temp}°C\nTempérature ressentie: ${~~response.main.feels_like}°C\nHumidité: ${response.main.humidity}%\nVitesse du vent: ${response.wind.speed}Km/h\nSens du vent: ${response.wind.deg}°%%`)
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

// music commands

commands.addCategoryName("Musique");

let dispacher;
let isPlaying = false;

commands.addCommand("ajouter", "Ajouter une musique à la liste.", async (requirements) => {

	let { message, args } = requirements;

	let url = args[0];

	// check if the url is given

	if (!url) {
		return message.reply(
			new Message()
				.setMain("Cette commande utilise les \"codes\" youtube, exemple:")
				.setDescription("##https://www.youtube.com/watch?v=cette partie là##")
				.end()
		);
	} else if (ytdl.validateURL(url) !== true) { // check if the code is a real youtube code
		return message.reply(
			new Message()
				.setMain("Ce lien ne convient pas !")
				.end()
		);
	};

	let info = (await ytdl.getBasicInfo(url)).videoDetails; // get info about the song

	console.log(info);

	try {
		addSong(message.guild.id, info); // add the song to the queue (in the database)
	} catch (err) {
		console.log(err);
	};

	message.reply( // success message
		new Message()
			.setMain(`##${info.title}## ajoutée à la liste ${emotes.success()}`)
			.end()
	);

});

commands.addCommand("playlist", "Montrer la liste des musiques.", async (requirements) => {

	let { message } = requirements;

	let songs = getSongs(message.guild.id);

	// give the music list


	if (songs.length !== 0) {
		message.reply(
			new Message()
				.setMain(`Voici la liste des prochaines musiques à lire ${emotes.success()}`)
				.setDescription(`%%${songs.map(song => `- ${song.title}\n    Nom de la chaine: ${song.ownerChannelName}`).join("\n")}%%`)
				.end()
		);
	} else {
		message.reply(
			new Message()
				.setMain(`La liste est vide...`)
				.end()
		);
	};

});

commands.addCommand("play", "Lire la prochaine musique de la playlist, <arg> correspond au volume (nombre entre 0 et 1).", async (requirements) => {

	let { message, args } = requirements;

	let songs = await getSongs(message.guild.id);

	// check if the user is in an audio channel

	let voiceChannel = message.member.voice.channel;
	if (!voiceChannel) {
		return message.reply(
			new Message()
				.setMain("Tu dois être connecté à un salon vocal !")
				.end()
		);
	};

	// check if the bot has the permission to connect to the voice channel

	let permissions = voiceChannel.permissionsFor(message.client.user);
	if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
		return message.reply(
			new Message()
				.setMain(`Je n'ai pas la permission de me connecter aux salons vocaux ${emotes.fail()}`)
				.end()
		);
	};

	// check if the queue is empty

	if (songs.length === 0) {
		return message.reply(
			new Message()
				.setMain("Il n'y a pas de musique dans la liste, ajoutes-en une avec ##!ajouter##.")
				.end()
		);
	};

	// check if the music is already playing

	if (isPlaying === true) return message.reply(
		new Message()
			.setMain("La musique est déjà en cours !\nUtilise ##!resume## pour remettre la musique si elle est en pause.")
			.end()
	);

	// function to play the current song in the queue

	let play = (message, connection) => {

		// if the list is empty: return

		if (songs.length === 0) {
			voiceChannel.leave();
			isPlaying = false;
			return message.reply(
				new Message()
					.setMain(`Liste de lecture vide...`)
					.end()
			);
		};

		// get the song in the queue and play it in the voice channel

		dispacher = connection.play(ytdl(songs[0].video_url, { filter: "audioonly" }), { volume: +args[0] || 0.8 })
			.on("start", () => {
				isPlaying = true;
				return message.reply(
					new Message()
						.setMain(`Lecture de ##${songs[0].title}## ${emotes.success()} (volume: ${args[0] || "0.8"})`)
						.end()
				);
			})
			.on("finish", () => { shiftSong(message.guild.id); play(message, connection) }) // when the song is finished: remove it and play the next one
			.on("error", error => { // if there is an error: console.log it and leave the audio channel
				console.error(error);
				isPlaying = false;
				return voiceChannel.leave();
			});

	};

	try {
		play(message, await voiceChannel.join()); // connect to the channel and play the song
	} catch (err) {
		console.log(err);
	};

});

commands.addCommand("pause", "Mettre en pause la musique.", async (requirements) => {

	let { message } = requirements;

	if (!dispacher) return message.reply(
		new Message()
			.setMain("Il faut d'abord lancer la musique !")
			.end()
	);

	// pause the music

	dispacher.pause();

	return message.reply(
		new Message()
			.setMain("La musique est en pause !")
			.end()
	);

});

commands.addCommand("resume", " musique.", async (requirements) => {

	let { message } = requirements;

	if (!dispacher) return message.reply(
		new Message()
			.setMain("Il faut d'abord lancer la musique !")
			.end()
	);

	// resume the music

	dispacher.resume();

	return message.reply(
		new Message()
			.setMain("La musique recommence !")
			.end()
	);

});

commands.addCommand("stop", "Arreter la musique.", async (requirements) => {

	let { message } = requirements;

	// check if the user is not connected to the channel

	if (!message.member.voice.channel) {
		return message.reply(
			new Message()
				.setMain("Tu dois être connecté à un salon vocal !")
				.end()
		);
	};

	// kill the audio connection

	dispacher.destroy();

	// leave the audio channel

	message.member.voice.channel.leave();

});

commands.addCommand("next", "Enlever la musique de la playlist.", (requirements) => {

	let { message } = requirements;

	// leave the channel

	message.member.voice.channel.leave();

	// remove the current song

	shiftSong(message.guild.id);

	message.reply(
		new Message()
			.setMain(`La musique a été enlevée de la playlist ${emotes.success()}`)
			.end()
	);

});

// entertainement commands

commands.addCategoryName("Commandes de divertissement");

// gives a random rate of <argument>

commands.addCommand("taux", "Taux aléatoire de <argument>.", (requirements) => {

	let { message, args } = requirements;

	// give a random rate of args

	message.reply(
		new Message()
			.setMain(`${message.author} a un taux de ${args.join(" ") || "quelque chose"} de ${Random(0, 100)}%...`)
			.end()
	);

});

// gives true or false randomly

commands.addCommand("vraioufaux", "Vrai ou faux <argument>.", (requirements) => {

	let { message, args, bot } = requirements;

	// true or false

	message.reply(
		new Message()
			.setMain(`${message.author}: ${args.join(" ") || "rien"}\n ** ${bot.user.username} **: ${RandomItem(["vrai", "faux"])} !`)
			.end()
	);

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