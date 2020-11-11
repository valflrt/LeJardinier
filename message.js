module.exports = class Message {
	constructor() {
		this.content = new Array();
		this.current = new Array();
	};

	reset() {
		this.current = [];
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
		this.content.push(this.current.join(" "));
		this.reset();
		return this;
	};

	codeBlockEnd() {
		this.content.push("\`\`\`" + (this.current.join(" ")) + "\`\`\`");
		this.reset();
		return this;
	};

	render() {
		let content = this.content.join("\n");
		console.log(this);
		if (content.length !== 0) {
			return (">>> " + content);
		} else {
			return "erreur: message vide";
		};
	};
};

class testMessage {
	constructor(obj) {

		let body = Object.entries(obj);

		this.content = new String(">>> ");

		body.forEach(element => {

			switch (element[0]) {

				case "text":
					this.content += (element[1] + "\n");
					break;

				case "code":
					this.content += ("\`\`\`" + element[1] + "\`\`\`\n");

			};

		});

	};
};

let hey = new testMessage({
	text: "hey",
	code: "hey"
});

console.log(hey);