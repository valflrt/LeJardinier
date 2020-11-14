const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync("./database/database.json");
const db = low(adapter);
const Item = require("./item");

// default config for db

db.defaults({ servers: [], shop: { items: [] } })
	.write();

// sets shop items

db.get("shop").set("items", [
	new Item("text", "- Items -"),
	new Item("Tomate", "Un fruit de valeur plus sentimentale que materielle.", 2),
	new Item("Pomme", "Hmmm que c'est bon !", 3),
	new Item("text", "- Améliorations -"),
	new Item("graines obtenues", "Augmente le nombre de graines obtenues (!recolter).", 26, user => { user.update("obtainingRate", or => or + 1).write() })
]).write();

// management

const addServer = (id) => {

	// adds a server to the server list in the db

	db.get("servers")
		.push({ id: id, users: [] })
		.write();
};

const addMember = (serverId, userId) => {

	// adds an user to a server in the db

	db.get("servers")
		.find({ id: serverId })
		.get("users")
		.push({ id: userId, seeds: 0, timeout: (new Date().getTime() - 3600001), obtainingRate: 1, items: new Array() })
		.write();
};

// seeds (money) management

const setSeed = (serverId, userId, amount) => {

	// seeds obtaining rate

	let obtainingRate = db.get("servers")
		.find({ id: serverId })
		.get("users")
		.find({ id: userId })
		.get("obtainingRate")
		.value();

	// set the new amount of seeds

	db.get("servers")
		.find({ id: serverId })
		.get("users")
		.find({ id: userId })
		.update("seeds", seeds => seeds += amount)
		.set("timeout", new Date().getTime())
		.write();
};

const getTimeleft = (serverId, userId) => {

	// obtains time left before to be able to get seeds

	let timeToWait = 3600000; // = one hour in milliseconds

	let userLastTime = db.get("servers")
		.find({ id: serverId })
		.get("users")
		.find({ id: userId })
		.get("timeout")
		.value();

	let timeleftMs = timeToWait - (new Date().getTime() - userLastTime);

	let seconds = Math.floor((timeleftMs / 1000) % 60),
		minutes = Math.floor((timeleftMs / (1000 * 60)) % 60);

	return {
		minutes: ((minutes < 10) ? 0 + minutes : minutes),
		seconds: ((seconds < 10) ? 0 + seconds : seconds),
		timeReached: (((new Date().getTime() - userLastTime) >= timeToWait) ? true : false)
	};
};

// shop

const buyItem = (serverId, userId, itemName) => {

	// buys an item in the shop

	return new Promise((resolve, reject) => {
		let user = db.get("servers")
			.find({ id: serverId })
			.get("users")
			.find({ id: userId });

		let userSeeds = user.get("seeds").value();
		let userItems = user.get("items");

		// checks if the item exists

		if (db.get("shop.items").find({ name: itemName }).value()) {
			var itemToBuy = db.get("shop.items").find({ name: itemName }).value();

			// checks if the user already bought the item

			if (!userItems.find({ name: itemName }).value()) {

				// checks if the user have enough seeds to buy the item

				if (itemToBuy.price <= userSeeds) {
					if (itemToBuy.action !== null) {
						itemToBuy.action(user);
					} else {
						userItems.push(itemToBuy).write();
					};
					user.update("seeds", seed => seed - itemToBuy.price).write();
					resolve(itemToBuy);
				} else {
					reject(`Tu n'as pas assez d'argent pour acheter cet item ! :cry:\nIl te faut au moins **${itemToBuy.price} graines**...`);
				};

			} else if (userItems.find({ name: itemName }).value()) {
				reject("Tu ne peux pas acheter cet item, tu le possèdes déjà... :confused:");
			} else {
				reject("Il y a une erreur inconnue lors de l'achat de cet item...");
			};

		} else {
			reject("Tu ne peux pas acheter cet item, il n'existe pas... :confused:")
		};

	});

};

// inventaire

const getInventaire = (serverId, userId) => {

	// returns the user's inventaire

	if (db.get("servers").find({ id: serverId }).get("users").find({ id: userId })) {
		return db.get("servers").find({ id: serverId }).get("users").find({ id: userId }).value();
	} else {
		return null;
	};
};

// exports functions

module.exports = { db, addServer, addMember, setSeed, getTimeleft, buyItem, getInventaire };