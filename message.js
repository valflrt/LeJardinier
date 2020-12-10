module.exports = class Message {
  setMain(str) {
    this.main = str;
    return this;
  };

  setDescription(description) {
    this.description = description;
    return this;
  };

  render() {
    return `${this.main}${(this.description) ? `\n>>> ${this.description}` : ""}`;
  };
};
