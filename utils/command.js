module.exports = class Command {
	constructor(command, description, execution) {
		this.command = command;
		this.description = description;
		this.execute = execution;
	};
};