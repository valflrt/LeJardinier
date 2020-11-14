module.exports.Random = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

module.exports.RandomItem = (words) => {
	let random = Math.floor((Math.random() * words.length));
	return words[random];
};

module.exports.MsToHours = (duration) => {
	var milliseconds = parseInt((duration % 1000) / 100),
		seconds = Math.floor((duration / 1000) % 60),
		minutes = Math.floor((duration / (1000 * 60)) % 60),
		hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;

	return {
		hours: hours,
		minutes: minutes,
		seconds: seconds
	};
};