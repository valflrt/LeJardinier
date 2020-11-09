module.exports = class Message {
	constructor() {
		this.content = [">>> "];
		this.currentLine = new Array();
	};

	resetCurrentLine() {
		this.currentLine = new Array();
	};

	addLine(str) {
		this.content.push(str);
		return this;
	};

	add(str) {
		this.currentLine.push(str);
		return this;
	};

	break() {
		this.content.push(this.currentLine.join(" "));
		this.resetCurrentLine();
		return this;
	};

	addCodeBlock(str) {
		this.content.push("\`\`\`" + str + "\`\`\`");
		return this;
	};

	render() {
		let content = this.content.join("\n").replace(/\n/, "");
		return content;
	};
};

class lastMessage {
	constructor() {
		this.content = [">>> "];
		this.currentLine = new Array();
	};

	resetCurrentLine() {
		this.currentLine = new Array();
	};

	addLine(str) {
		this.content.push(str);
		return this;
	};

	add(str) {
		this.currentLine.push(str);
		return this;
	};

	break() {
		this.content.push(this.currentLine.join(" "));
		this.resetCurrentLine();
		return this;
	};

	addCodeBlock(str) {
		this.content.push("\`\`\`" + str + "\`\`\`");
		return this;
	};

	render() {
		let content = this.content.join("\n").replace(/\n/, "");
		return content;
	};
};