module.exports.Random = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

module.exports.RandomWord = (words) => {
	let min = 0;
	let max = words.length;
	let random = Math.floor(Math.random() * (max - min + 1) + min);
	return words[random];
};