// random integer between min and max

module.exports.Random = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

// random array item

module.exports.RandomItem = (items) => {
	let random = Math.floor((Math.random() * items.length));
	return items[random];
};