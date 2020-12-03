const Command = require("../base/Command.js");

class Example extends Command 
{
	constructor (client) 
	{
		super(client, 
		{
			name: "Example", //command name, should match class.
			description: "An example command for quickly creating more commands", //description
			usage: "Example", //usage details. Should match the name and class
			aliases: ["exampel"]
		});
	}

	async run (message, args, level) 
	{ // eslint-disable-line no-unused-vars
		try 
		{
			message.channel.send("You ran an example command! Why...?");
		} catch (e) 
		{
			console.log(e);
		}
	}
}

module.exports = Example; //<------------ Don't forget this one!
