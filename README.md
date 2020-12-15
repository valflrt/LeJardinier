# LeJardinier

A simple and fast discord bot (french language only).

# Installation

Install the dependencies using:
```npm install```

## Config and token

* [config.json](./config.json): config file.
* [token.json](./token.example.json) (link: file example): bot's token.
* [bot.js](./bot.js): main file.
* [commands.js](./commands.js): commands.
* [utils/](./utils/)
	* [collection.js](./utils/collection.js): command collection constructor.
	* [toolbox.js](./utils/toolbox.js): some functions to do some things.
* [db.js](./db.js): database handler (lowdb: a local json database).
* [message.js](./message.js): message constructor (look at [commands.js](./commands.js) to get an example).
* [emotes.js](./emotes.js): random emote (success / fail).
* [troll.js](./troll.js): simple message detection for fun (eg: when someone say ok the bot add an angry reaction).

and voila !
