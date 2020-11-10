const Command = require("./command");
const Message = require("./message");
const { Random, RandomWord } = require("./toolbox");
const setPresence = require("./presence");
const fetch = require("node-fetch");

let commands = new Array();

/*-----------------------------------*/

commands.push(new Command("ping", "Commande de test.", (message, args, bot) => {

	message.channel.send(
		new Message()
			.add("pong :ping_pong: !")
			.blockEnd()
			.render()
	);

}));

/*-----------------------------------*/

commands.push(new Command("hey", "[] - Dire bonjour au bot.", (message, args, bot) => {

	message.channel.send(
		new Message()
			.add(`${RandomWord(["Salut", "Coucou", "Bonjour"])} ${message.author.username} !`)
			.add(`${RandomWord([":grin:", ":partying_face:", ":thumbsup:"])}`)
			.blockEnd()
			.render()
	);

}));

/*-----------------------------------*/

commands.push(new Command("repetes", "[texte] - Faire répèter quelque chose au bot.", (message, args, bot) => {

	message.channel.send(
		new Message()
			.add(args.join(" "))
			.blockEnd()
			.render()
	);

}));

/*-----------------------------------*/

commands.push(new Command("joues", "[texte] - Faire jouer le bot à quelque chose.", (message, args, bot) => {

	message.channel.send(
		new Message()
			.add(`Comme tu veux ${RandomWord([":ok_hand:", ":thumbsup:"])}`)
			.blockEnd()
			.render()
	);

	setPresence(bot, args.join(" "));

	setTimeout(() => {
		setPresence(bot);
	}, 20000);

}));

/*-----------------------------------*/

commands.push(new Command("moi", "[] - Faire répèter quelque chose au bot.", (message, args, bot) => {

	message.channel.send(
		new Message()
			.add(`Voici quelques informations à propos de ${message.author.username}`)
			.add(`${[":yum:", ":partying_face:", ":thumbsup:"][toolbox.Random(0, 2)]}`)
			.blockEnd()
			.add(`Nom d'utilisateur: ${message.author.username}`).break()
			.add(`Numéro d'identification: ${message.author.id}`)
			.blockEnd()
			.render()
	);

}));

/*-----------------------------------*/

commands.push(new Command("meteo", "[ville] - Le bot donne la météo pour la vile donnée.", (message, args, bot) => {

	url = `https://api.openweathermap.org/data/2.5/weather?q=${args.join("+")}&appid=90c2de24c1a8f38d24475038e42da54a&lang=fr&units=metric`;

	fetch(url)
		.then(response => response.json())
		.then(response => {
			message.channel.send(
				new Message()
					.add(`Voici la météo dans la ville de ${render.bold(args.join(" "))} :partying_face:`)
					.blockEnd()
					.add(`Description: ${response.weather[0].description}`).break()
					.add(`Température: ${response.main.temp}°C`).break()
					.add(`Température ressentie: ${response.main.feels_like}°C`).break()
					.add(`Humidité: ${response.main.humidity}%`)
					.codeBlockEnd()
					.render()
			);
		})
		.catch((err) => {
			console.log(err);
			message.channel.send(
				new Message()
					.add(`Oups je ne peux pas trouver la météo pour cette ville... :confounded:`)
					.render()
			);
		});

}));

module.exports = commands;