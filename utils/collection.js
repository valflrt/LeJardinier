// create a command

class Command {
	constructor(name, description, execution) {
		this.name = name;
		this.description = description;
		this.execute = execution;
		this.isCommand = true;
	};
};

// create a command collection

module.exports.Collection = class Collection {
	constructor() {
		this.commands = new Array();
	};

	addCommand(name, description, execution) {
		this.commands.push(new Command(name, description, execution));
	};

	addCategoryName(name) {
		this.commands.push({ name: name });
	};

	execute(name, args) {
		if (this.commands.find(command => command.name === name)) {
			this.commands.find(command => command.name === name).execute(args);
		};
	};

	exists(name) {
		if (this.commands.find(command => command.name === name)) {
			return true;
		} else {
			return false;
		};
	};

	toList() {
		return this.commands.map(command => {
			return (command.isCommand === true) ? `**${command.name}**\n${command.description}` : `\n__**${command.name}**__\n`;
		}).join("\n");
	};
};