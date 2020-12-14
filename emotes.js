let { RandomItem } = require("./utils/toolbox");

const success = () => RandomItem([":partying_face:", ":tada:", ":grin:", ":thumbup:", ":yum:", ":ok_hand:", ":sparkles:"]);

const fail = () => RandomItem([":confounded:", ":boom:", ":x:"]);

module.exports = { success, fail };