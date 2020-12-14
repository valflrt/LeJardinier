// random integer between min and max

module.exports.RandomN = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

// random item

module.exports.RandomItem = () => {
	let random = Math.floor((Math.random() * arguments.length));
	return arguments[random];
};

// random array item

module.exports.FormatDateFromMs = (ms) => {
	let date = new Date(ms);
	return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`
};