const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./database/database.json');
const db = low(adapter);

db.defaults({ servers: [] })
	.write();

const addServer = (id) => {
	db.get("servers")
		.push({ id: id, users: [] })
		.write();
};

const addMember = (serverId, userId) => {
	db.get("servers")
		.find({ id: serverId })
		.get("users")
		.push({ id: userId, seeds: 0, timeout: undefined })
		.write();
};

const updateSeeds = (serverId, userId, amount) => {
	db.get("servers")
		.find({ id: serverId })
		.get("users")
		.find({ id: userId })
		.update("seeds", seeds => seeds += amount)
		.set("timeout", new Date().getTime())
		.write();
};

const checkTimeout = (serverId, userId, currentTime) => {
	let userTimeout = db.get("servers")
		.find({ id: serverId })
		.get("users")
		.find({ id: userId })
		.get("timeout")
		.value();

	let difference = currentTime - userTimeout;

	let returned = (difference >= 43200000) ? true : false;

	return returned;

};

module.exports = { db, addServer, addMember, updateSeeds, checkTimeout };