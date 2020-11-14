// generates a shop item

module.exports = class Item {
	constructor(name, description, price, action) {
		this.name = name;
		this.description = description || null;
		this.price = price || null;
		this.action = action || null;
	};
};