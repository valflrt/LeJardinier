const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync("./database/database.json");
const db = low(adapter);

// default config for db

db.defaults({ servers: [] })
	.write();

// management

const addServer = (id) => {

	// add a server to the server list in the db

	try {
		let servers = db.get("servers")

		if (!servers.find({ id: id })) {
			servers.push({ id: id, users: [] })
				.write();
		};
	} catch (err) {
		console.log(err);
	};

};

const addMember = (serverId, userId) => {

	// add an user to a server in the db

	try {
		let users = db.get("servers")
			.find({ id: serverId })
			.get("users");

		if (!users.find({ id: userId })) {
			users.push({ id: userId, xp: 0, lvl: 0 })
				.write();
		};
	} catch (err) {
		console.log(err);
	};

};

// level management

const updateXp = (serverId, userId) => {

	// update the xp of one user

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

const getLvl = (serverId, userId) => {

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

module.exports = { db, addServer, addMember, updateXp, getLvl };