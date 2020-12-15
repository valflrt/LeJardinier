class Queue {
	constructor() {
		this.content = new Array();
	};

	add(item) {
		this.content.push(item);
	};

	current() {
		return this.content[0];
	};

	dequeue() {
		return this.content.shift();
	};
};

module.exports = { Queue };