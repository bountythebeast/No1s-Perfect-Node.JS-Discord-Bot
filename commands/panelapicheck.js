const Command = require("../base/Command.js");
const node = require('nodeactyl');
const application = node.Application;
const PterodactylPanel = require("../data/PterodactylPanel.json");

class panelapicheck extends Command 
{
	constructor (client) 
	{
		super(client, 
		{
			name: "panelapicheck", //command name, should match class.
			description: "Admin command to test if the Host/API pair are working properly. Returns true/false.", //description
            usage: "panelapicheck", //usage details. Should match the name and class
            category: "Bot Admin Commands",
            permLevel: "Bot Admin"
		});
	}

	async run (message, args, level) 
	{
        application.login(PterodactylPanel.HOST, PterodactylPanel.APIKey, (logged_in, msg) => 
        {
            message.channel.send("Host/APIkey pair worked: "+logged_in)
            console.log("Host/APIKey pair worked: "+logged_in); // return a Boolean (true/false) if logged in.
        })
	}
}

module.exports = panelapicheck; //<------------ Don't forget this one!
