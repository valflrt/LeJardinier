const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const db = low(new FileSync("./database.json"));
const config = require("./config.json");

// default config for db

db.defaults({ servers: [] })
	.write();

// management

function updateDB(serverId, userId) {

	// add a server to the server list in the db

	try {

		let servers = db.get("servers");

		if (servers.find({ id: serverId })) {
			servers.push({ id: serverId, users: [] })
				.write();
		};

		let users = servers.find({ id: serverId })
			.get("users");

		console.log(db.value());

		if (users.find({ id: userId })) {
			users.push({ id: userId, xp: 0, lvl: 0, lvlCost: config })
				.write();
		};

		updateXP(serverId, userId);

	} catch (err) {

		console.log(err);

	};

};

// level management

function updateXP(serverId, userId) {

	// update the an user's xp

	try {
		db.get("servers")
			.find({ id: serverId })
			.get("users")
			.find({ id: userId })
			.update("xp", xp => xp + 1)
			.write();
	} catch (err) {
		console.log(err);
	};

};

function getLvl(serverId, userId) {

	// get lvl and xp from an user

	let user = db.get("servers")
		.find({ id: serverId })
		.get("users")
		.find({ id: userId });

	return {
		xp: user.get("xp").value(),
		lvl: user.get("lvl").value()
	};

};

// export functions

module.exports = { db, updateDB, updateXP, getLvl };