const Command = require("../base/Command.js");

class whereami extends Command 
{
	constructor (client) 
	{
		super(client, 
		{
			name: "whereami", //command name, should match class.
			description: "A fun command, which provides a list of servers that this bot is in!", //description
            usage: "whereami" //usage details. Should match the name and class
            
        });
        this.client = client;
	}

	async run (message, args, level) 
	{ 
        message.channel.send("List of current servers the bot is in:"+` ${this.client.guilds.cache.size} server(s)! \nHere's a list of their names!` +" \n```"+ this.client.guilds.cache.map(guild => guild.name)+"```")
	}
}

module.exports = whereami; //<------------ Don't forget this one!
