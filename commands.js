const Command = require("./command");
const { Random, RandomWord } = require("./toolbox");
const setPresence = require("./presence");
const fetch = require("node-fetch");

let commands = new Array();

/*-----------------------------------*/

commands.push(new Command("ping", "Commande de test.", (message, args, bot) => {

	message.channel.send(`>>> Pong :ping_pong: !`);

}));

/*-----------------------------------*/

commands.push(new Command("", "Faire dire ok au bot.", (message, args, bot) => {

	message.channel.send(`>>> ok`);

}));

/*-----------------------------------*/

commands.push(new Command("hey", "[] - Dire bonjour au bot.", (message, args, bot) => {

	message.channel.send(`>>> ${RandomWord(["Salut", "Coucou", "Hey"])} ${message.author.username} ! ${RandomWord([":grin:", ":partying_face:", ":thumbsup:"])}`);

}));

/*-----------------------------------*/

commands.push(new Command("repetes", "[texte] - Faire répèter quelque chose au bot.", (message, args, bot) => {

	message.channel.send(">>> " + args.join(" "));

}));

/*-----------------------------------*/

commands.push(new Command("joues", "[texte] - Faire jouer le bot à quelque chose.", (message, args, bot) => {

	message.channel.send(`>>> Comme tu veux ${RandomWord([":ok_hand:", ":thumbsup:"])}`);

	setPresence(bot, args.join(" "));

	setTimeout(() => {
		setPresence(bot);
	}, 20000);

}));

/*-----------------------------------*/

commands.push(new Command("moi", "[] - Faire répèter quelque chose au bot.", (message, args, bot) => {

	message.channel.send(`>>> Voici quelques informations à propos de ${message.author.username} ${RandomWord([":yum:", ":partying_face:", ":thumbsup:"])}\n\`\`\`Nom d'utilisateur: ${message.author.username}\nNuméro d'identification: ${message.author.id}`);

}));

/*-----------------------------------*/

commands.push(new Command("meteo", "[ville] - Le bot donne la météo pour la vile donnée.", (message, args, bot) => {

	url = `https://api.openweathermap.org/data/2.5/weather?q=${args.join("+")}&appid=90c2de24c1a8f38d24475038e42da54a&lang=fr&units=metric`;

	fetch(url)
		.then(response => response.json())
		.then(response => {
			message.channel.send(`Voici la météo dans la ville de **${args.join(" ")}** : partying_face:\n\`\`\`Description: ${response.weather[0].description}\nTempérature: ${response.main.temp}°C\nTempérature ressentie: ${response.main.feels_like}°C\nHumidité: ${response.main.humidity}%\`\`\``);
		})
		.catch((err) => {
			console.log(err);
			message.channel.send(`Oups je ne peux pas trouver la météo pour cette ville... :confounded:`);
		});

}));

module.exports = commands;