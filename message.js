module.exports = class Message {
	setMain(str) {
		this.main = this.parse(str);
		return this;
	};

	setDescription(str) {
		str = this.parse(str);
		this.description = str;
		return this;
	};

	parse(str) {
		if (!str || str === null || str === "") return null;
		str = str.replace(/%%/g, () => "\`\`\`");
		str = str.replace(/##/g, () => "\`");
		return str;
	};

	end() {
		return `${this.main}${(!this.description || this.description === null) ? "" : `\n${this.description}`}`;
	};
};
