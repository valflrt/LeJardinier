const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const db = low(new FileSync("./database.json"));
const { firstLvlCost, lvlFactor } = require("./config.json");

// default config for db

db.defaults({ servers: [] })
	.write();

// management

function updateDB(serverId, userId) {

	// add a server to the server list in the db

	return new Promise((resolve, reject) => {
		try {

			let servers = db.get("servers");

			if (!servers.find({ id: serverId }).value()) {
				servers.push({ id: serverId, users: [] })
					.write();
			};

			let users = servers.find({ id: serverId })
				.get("users");

			if (!users.find({ id: userId }).value()) {

				users.push({ id: userId, xp: 0, lvl: 0, xpMax: firstLvlMaxXp })
					.write();
			};

		} catch (err) {
			console.log(err);
			reject(err);
		};

		resolve(updateXP(serverId, userId));

	});

};

// level management

function updateXP(serverId, userId) {

	// update the an user's xp

	try {

		let user = db.get("servers")
			.find({ id: serverId })
			.get("users")
			.find({ id: userId })

		user.update("xp", xp => xp + 1)
			.write();

		let userValue = user.value();

		if (userValue.xp >= userValue.xpMax) {

			user.set("xp", 0)
				.update("lvl", lvl => lvl + 1)
				.update("xpMax", xpMax => Math.round(xpMax * xpFactor))
				.write();

			return {
				lvlUp: true,
				lvl: userValue.lvl,
				xp: userValue.xp
			};
		};

		return {
			levelUp: false,
			lvl: userValue.lvl,
			xp: userValue.xp
		};

	} catch (err) {
		console.log(err);
	};

};

function getStats(serverId, userId) {

	// get lvl and xp from an user

	let user = db.get("servers")
		.find({ id: serverId })
		.get("users")
		.find({ id: userId })
		.value();

	return { xp: user.xp, xpMax: user.xpMax, lvl: user.lvl };

};

// export functions

module.exports = { db, updateDB, updateXP, getStats };