# LeJardinier

A simple and fast discord bot (french language only).

# Installation

Install the dependencies using:
```npm install```

## Config and token

* [config.json](./config.json): the config file.
* [token.json](./token.json): the token source:
```json
{
	"token": "your token goes here"
}
```
* [bot.js](./bot.js): the main file.
* [commands.js](./commands.js): commands.
* [utils/](./utils/)
	* [collection.js](./utils/collection.js): make a command collection and "format" them.
	* [toolbox.js](./utils/toolbox.js): some functions to some things.
* [db.js](./db.js): database handler (lowdb: a local json database).
* [message.js](./message.js): message constructor (look at [commands.js](./commands.js) to get an example).
* [troll.js](./troll.js): simple message detection for fun (eg: when someone say ok the bot add an angry reaction).

and voila !