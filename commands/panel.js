const Command = require("../base/Command.js");
const nodeactyl = require('nodeactyl-v1-support');
const nodeClient = nodeactyl.Client;
const node = require('nodeactyl');
const Application = node.Application;
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
        nodeClient.login(PterodactylPanel.HOST,PterodactylPanel.ClientAPI, (logged_in, msg) =>
        {
            console.log("Log in Client (user): "+logged_in)
            Application.login(PterodactylPanel.HOST,PterodactylPanel.ApplicationAPI, (logged_in, msg) =>
            {
                console.log("Log in Application (admin): "+logged_in)
                
                let returnstring = [];
                Application.getAllServers().then(servers =>
                {
                    for (let serverdata of Object.values(servers))
                    {
                        serverdata = serverdata.attributes
                        nodeClient.getServerStatus(serverdata.id).then((status) => 
                        {
                            var NextServerStatus = 
                            {
                                ServerName: serverdata.name,
                                ServerStatus: status
                            }
                            returnstring.push(NextServerStatus)
                        }).catch((error) => 
                        {
                            console.log(error)
                        });
                        console.log(returnstring)
                    }
                    console.log("all servers:")
                    console.log(stringTable.create(returnstring))
                }).catch(err =>
                {
                    console.log(err); 
                });
            });

        });

        /*
        application.getAllServers().then((response) => 
        {
            try
            {
                Client.login(PterodactylPanel.HOST2, PterodactylPanel.APIKey2, (logged_in, err) =>
                {
                    console.log("Client.login result: "+logged_in);
                });
            }
            catch(errors)
            {
                console.log(errors)
            }
            finally
            {
                for (let serverdata of Object.values(response))
                {
                    serverdata = serverdata.attributes
                    Client.getServerStatus(serverdata.id).then((status) => 
                    {
                        var NextServerStatus = 
                        {
                            ServerName: serverdata.name,
                            ServerStatus: status
                        }
                        returnstring.push(NextServerStatus)
                    }).catch((error) => 
                    {
                        console.log(error)
                    });
                    console.log(returnstring)
                }
                console.log(stringTable.create(returnstring))
            }
            //message.channel.send(stringTable.create(returnstring))
        })
        .catch((error) => 
        {
            console.log(error);
        });
        */
	}
}

module.exports = panel; //<------------ Don't forget this one!
