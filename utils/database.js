const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('./db.json')
const db = low(adapter);

db.defaults({ servers: [] })
	.write();

const addServer = (id) => {
	db.get("servers")
		.push({ id: id, users: [] })
		.write();
};

const addMember = (serverId, id) => {
	db.get("servers")
		.find(server => server.id === serverId)
		.get("users")
		.push({ id: id, seeds: 0 })
		.write();
};

const updateMoney = (serverId, userId, amount) => {
	db.get("servers")
		.find(server => server.id === serverId)
		.get("users")
		.find(user => user.id === userId)
		.update("seeds", seeds => seeds += amount)
		.write();
};

module.exports = { db, addServer, addMember, updateMoney };