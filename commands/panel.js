const Command = require("../base/Command.js");
const node = require('nodeactyl');
const Client = node.Client;
const application = node.Application;
const PterodactylPanel = require("../data/PterodactylPanel.json");
var stringTable = require('string-table');

class panel extends Command 
{
	constructor (client) 
	{
		super(client, 
		{
			name: "panel", //command name, should match class.
			description: "Admin command for use with Panel commands.", //description
            usage: "panel <panel command> (A full description of available commands will come later...", //usage details. Should match the name and class
            category: "Bot Admin Commands",
            permLevel: "Bot Admin"
		});
	}

	async run (message, args, level) 
	{
        application.login(PterodactylPanel.HOST, PterodactylPanel.APIKey, (logged_in, err) => 
        {
            console.log("Client.login result: "+logged_in);
        });
        let returnstring = [];
        application.getAllServers().then((response) => 
        {
            for (let serverdata of Object.values(response))
            {
                serverdata = serverdata.attributes
                /*
                Client.login(PterodactylPanel.HOST,PterodactylPanel.APIKey, (logged_in,err) => {});
                Client.getServerStatus(serverdata.id).then((status) =>
                {
                    console.log(status)
                }).catch((error)=> {console.log(error)})
                */ //This doesn't work yet ^, its out of sync and it also just doesn't work yet.
                var NextServerStatus = 
                {
                    ServerName: serverdata.name,
                    ServerStatus: serverdatastatus
                }
                returnstring.push(NextServerStatus)
                console.log(returnstring)
            }
            console.log(stringTable.create(returnstring))
            //message.channel.send(stringTable.create(returnstring))
        })
        .catch((error) => 
        {
            console.log(error);
        });
	}
}

module.exports = panel; //<------------ Don't forget this one!
