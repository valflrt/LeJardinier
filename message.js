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


class testMessage {
	constructor() {
		this.content = [">>> "];
		this.current = new Array();
	};

	resetCurrentLine() {
		this.current = new Array();
	};

	// line

	startLine() {
		this.current.push();
		return this;
	};

	endLine() {
		this.content.push(this.currentLine.join(" "));
		this.resetCurrentLine();
		return this;
	};

	// code block

	startCodeBlock() {
		this.current.push("\`\`\`");
		return this;
	};

	endCodeBlock() {
		this.content;
		return this;
	};

	// methods

	append(str) {
		this.current.push(str);
		return this;
	};

	break() {
		this.current.push("\n");
	};

	render() {
		return (this.content.join("\n").replace(/\n/, ""));
	};
};