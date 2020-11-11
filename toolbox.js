module.exports.Random = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

module.exports.RandomWord = (words) => {
	let random = Math.floor((Math.random() * words.length));
	return words[random];
};