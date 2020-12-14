// create a command

class Command {
	constructor(name, description, execution, isHidden = false) {
		this.name = name;
		this.description = description;
		this.execute = execution;
		this.isCommand = true;
		this.isHidden = isHidden;
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
		this.commands.push({ name: name, isCommand: false });
	};

	addHiddenCommand(name, execution) {
		this.commands.push(new Command(name, null, execution, true));
	};

	execute(name, requirements, force = false) {

		let command = this.commands.find(command => command.name === name) || null;

		if (command !== null) {
			if (command.isHidden === false && force !== false) {
				command.execute(requirements);
			} else {
				command.execute(requirements);
			};
		};
	};

	exists(name) {
		let command = this.commands.find(command => command.name === name) || null;

		if (command !== null) {
			if (command.isHidden === false) {
				return true;
			} else {
				return false;
			};
		} else {
			return false;
		};
	};

	toList() {
		return this.commands.map(command => {
			if (command.isHidden) {
				return "";
			} else if (command.isCommand === false) {
				return `\n - ${command.name}\n`
			} else {
				return `    [${command.name}] ${command.description}`;
			};
		}).join("\n");
	};
};