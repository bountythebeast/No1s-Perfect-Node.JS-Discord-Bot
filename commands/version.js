const Command = require("../base/Command.js");
const {BotVersion,LastUpdated,LastUpdatedBy,NewFeatures,RemovedFeatures,Pendingchanges} = require("../data/version.json");

class version extends Command 
{
	constructor (client) 
	{
		super(client, 
		{
			name: "version",
			description: "Writes the Current Version, and any notable changes to the bot!",
			usage: "version",
			aliases: ["v","version","currentversion"]
		});
	}

	async run (message, args, level) 
	{
		try 
		{
			var newline = "\n"
			var returnstring = "```css\n"+"BotVersion: "+BotVersion+newline+"Last Updated: "+LastUpdated+newline+"Last Updated By: "+LastUpdatedBy+newline+"New Features: \n"+NewFeatures+newline+"Removed Features: "+RemovedFeatures+newline+"Comming soon: "+Pendingchanges+"```";
			message.channel.send(returnstring);
		} 
		catch (e) 
		{
			console.log(e);
		}
	}
}

module.exports = version;
