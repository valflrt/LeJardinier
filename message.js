module.exports = class Message {
	constructor() {
		this.content = new Array();
		this.current = new Array();
	};

	reset() {
		this.current = new Array();
	};

	add(str) {
		this.current.push(str);
		return this;
	};

	break() {
		this.current.push("\n");
		return this;
	};

	blockEnd() {
		this.content.push("\`\`\`" + this.current.join(" ") + "\`\`\`");
		this.reset();
		return this;
	};

	codeBlockEnd() {
		this.content.push("\`\`\`" + this.current.join(" ") + "\`\`\`");
		this.reset();
		return this;
	};

	render() {
		return (">>> " + this.content.join("\n"));
	};
};