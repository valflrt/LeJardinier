# LeJardinier

A simple and fast discord bot (french language only).

# Installation

Install the dependencies using:
```npm install```

## Config and token

[config.json](./config.json) is the config file:
```json
{
	"username": "Le Jardinier", // here is the username,
	"prefix": "!", // the command prefix
	"activity": { // this is already formatted for antering it as argument in bot.setPresence()
		"activity": {
			"name": "!help" // just put the game name you want your bot to play
		},
		"status": "online" // and here you can set the status
	}
}
```

Your token must be in [token.json](./token.json):
```json
{
	"token": "your token goes here"
}
```