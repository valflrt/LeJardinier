module.exports = class Message {
	setMain(str) {
		str.replace(/^[.]/, str[0].toUpperCase()); /* turns the first letter to a capital */
		this.main = str;
		return this;
	};

	setDescription(description) {
		if (description !== null || description) {
			this.description = description.replace(/##/g, () => "\`\`\`");
		} else {
			this.description = null;
		};

		return this;
	};

	end() {
		return `${this.main}${(!this.description || this.description === null) ? "" : `\n>>> ${this.description}`}`;
	};
};