const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('./database.json');
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
		.push({ id: userId, seeds: 0, timeout: (new Date().getTime() - 3600001), gettingRate: 1 })
		.write();
};

const updateSeeds = (serverId, userId, amount) => {
	let gettingRate = db.get("servers")
		.find({ id: serverId })
		.get("users")
		.find({ id: userId })
		.get("gettingRate")
		.value();

	db.get("servers")
		.find({ id: serverId })
		.get("users")
		.find({ id: userId })
		.update("seeds", seeds => seeds += (amount * gettingRate))
		.set("timeout", new Date().getTime())
		.write();
};

const getTimeleft = (serverId, userId) => {

	let timeToWait = 3600000;

	let userLastTime = db.get("servers")
		.find({ id: serverId })
		.get("users")
		.find({ id: userId })
		.get("timeout")
		.value();

	let timeleftMs = timeToWait - (new Date().getTime() - userLastTime);

	let milliseconds = parseInt((timeleftMs % 1000) / 100),
		seconds = Math.floor((timeleftMs / 1000) % 60),
		minutes = Math.floor((timeleftMs / (1000 * 60)) % 60);

	return {
		minutes: ((minutes < 10) ? 0 + minutes : minutes),
		seconds: ((seconds < 10) ? 0 + seconds : seconds),
		timeReached: (((new Date().getTime() - userLastTime) >= timeToWait) ? true : false)
	};
};

module.exports = { db, addServer, addMember, updateSeeds, getTimeleft };