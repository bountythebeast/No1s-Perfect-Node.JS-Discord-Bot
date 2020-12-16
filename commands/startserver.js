const Command = require("../base/Command.js");
const nodeactyl = require('nodeactyl-v1-support');
const Client = nodeactyl.Client;
const node = require('nodeactyl');
const Application = node.Application;
const PterodactylPanel = require("../data/PterodactylPanel.json");
var stringTable = require('string-table');

class startServer extends Command 
{
	constructor (client) 
	{
		super(client, 
		{
			name: "startServer", //command name, should match class.
			description: "Admin command for use with Panel commands.", //description
            usage: "startServer <server name> | leave blank for all. Full list of Options (currently): \n survival,fivem,hub,rsp,relaxedsurvivalplus,skyblock,survivalhub,bungee,creative,factions,stafftest,limbo,login,ark,bo3,blackops,blackops3,cod4", //usage details. Should match the name and class
            category: "Bot Admin Commands",
            permLevel: "Bot Admin"
		});
	}

	async run (message, args, level) 
	{
        Client.login(PterodactylPanel.HOST,PterodactylPanel.ClientAPI, (logged_in, msg) =>
        {
            console.log("Log in Client (user): "+logged_in)
            Application.login(PterodactylPanel.HOST,PterodactylPanel.ApplicationAPI, (logged_in, msg) =>
            {
                console.log("Log in Application (admin): "+logged_in)
                panelSetup(message).then(temp => switchCase(temp)).then(result => {message.channel.send("```"+result+"```")}).catch(error => {console.log("Errors in startServer command. \n"+error)})
                async function panelSetup(message)
                {
                    try
                    {
                        let messagestring = await CleanMessage(message.content.toString());
                        function CleanMessage(message)
                        {
                            message = message.substring(message.indexOf(" ")+1)
                            return message;
                        }
                        return messagestring;
                    }
                    catch(e)
                    {
                        console.log("error in trycatch: \n"+e)
                    }
                }
                function switchCase(processarg)
                {
                    return new Promise( (resolve) =>
                    {
                        let temp
                        switch (processarg) 
                        {
                            case "survival":
                                startServer("9df8864b","Survival").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            case "fivem":
                                startServer("9320ca1a","FiveM").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            case "hub":
                                startServer("c59c7841","Hub").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            case "rsp":
                            case "relaxedsurvivalplus":
                                startServer("a2d148da","Relaxed Survival Plus").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            case "skyblock":
                                startServer("f87f9f27","SkyBlock").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            case "survivalhub":
                                startServer("7c87b0ee","Survival Hub").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            case "bungee":
                                startServer("7cd26083","Bungee").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            case "creative":
                                startServer("3f6eaf78","Creative").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            case "factions":
                                startServer("1b500ccb","Factions").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            case "stafftest":
                                startServer("88ebd7df","Staff Test").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            case "limbo":
                            case "login":
                                startServer("5a0cd357","Limbo/Login").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            case "ark":
                                startServer("35e1c983","ARK").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            case "bo3":
                            case "blackops":
                            case "blackops3":
                                startServer("fd9a617f","Black Ops 3").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            case "cod4":
                                startServer("6e64eda2","COD 4").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            default:
                                resolve("Error, cannot start null servers.");
                                break;
                        }
                    });
                }
            });

        });
        function startServer(identifier,servername)
        {
            return new Promise( (resolve) =>
            {
                Client.getServerStatus(identifier).then((status) =>
                {
                    if((status !== "running") || (status !== "starting"))
                    {
                        Client.startServer(identifier).then((resposne) =>
                        {
                            resolve({"ServerName": servername,"ServerStatus": "Start Command issued, Server starting."})
                        }).catch((err) =>
                        {
                            console.log(err)
                            resolve({"ServerName": servername,"ServerStatus": "Failed to start! Check Console."})
                        });
                    }
                    else
                    {
                        resolve({"ServerName": servername,"ServerStatus": "Server is already Running!"})
                    }
                }).catch((error) =>
                {
                    console.log(error)
                    resolve({"ServerName": servername,"ServerStatus": "Unknown State. Check Console."});
                });
            });
        }
	}
}

module.exports = startServer; //<------------ Don't forget this one!