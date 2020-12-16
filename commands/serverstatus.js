const Command = require("../base/Command.js");
const nodeactyl = require('nodeactyl-v1-support');
const Client = nodeactyl.Client;
const node = require('nodeactyl');
const Application = node.Application;
const PterodactylPanel = require("../data/PterodactylPanel.json");
var stringTable = require('string-table');

class serverstatus extends Command 
{
	constructor (client) 
	{
		super(client, 
		{
			name: "serverstatus", //command name, should match class.
			description: "Admin command for use with Panel commands.", //description
            usage: "serverstatus <server name> | leave blank for all. Full list of Options (currently): \n survival,fivem,hub,rsp,relaxedsurvivalplus,skyblock,survivalhub,bungee,creative,factions,stafftest,limbo,login,ark,bo3,blackops,blackops3,cod4", //usage details. Should match the name and class
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
                panelSetup(message).then(temp => switchCase(temp)).then(result => {message.channel.send("```"+result+"```")}).catch(error => {console.log("Errors in serverstatus command. \n"+error)})
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
                                isOnline("9df8864b","Survival").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            case "fivem":
                                isOnline("9320ca1a","FiveM").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            case "hub":
                                isOnline("c59c7841","Hub").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            case "rsp":
                            case "relaxedsurvivalplus":
                                isOnline("a2d148da","Relaxed Survival Plus").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            case "skyblock":
                                isOnline("f87f9f27","SkyBlock").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            case "survivalhub":
                                isOnline("7c87b0ee","Survival Hub").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            case "bungee":
                                isOnline("7cd26083","Bungee").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            case "creative":
                                isOnline("3f6eaf78","Creative").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            case "factions":
                                isOnline("1b500ccb","Factions").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            case "stafftest":
                                isOnline("88ebd7df","Staff Test").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            case "limbo":
                            case "login":
                                isOnline("5a0cd357","Limbo/Login").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            case "ark":
                                isOnline("35e1c983","ARK").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            case "bo3":
                            case "blackops":
                            case "blackops3":
                                isOnline("fd9a617f","Black Ops 3").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            case "cod4":
                                isOnline("6e64eda2","COD 4").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            default:
                                allservers();
                                break;
                        }
                    });
                }
                function allservers()
                {
                    Application.getAllServers().then(serverdata =>
                    {
                        var values = Object.values(serverdata);
                        const promises = [];
                        values.forEach(async(serverdata,index) =>
                        {
                            promises.push(isOnline(serverdata.attributes.identifier,serverdata.attributes.name))
                        });
                        Promise.all(promises).then(results =>
                        {
                            console.log(results)
                            message.channel.send("```\n"+stringTable.create(results)+"```")
                        });
                    }).catch(err =>
                    {
                        console.log(err); 
                    });
                }
            });

        });
        function isOnline(identifier,servername)
        {
            return new Promise( (resolve) =>
            {
                Client.getServerStatus(identifier).then((status) =>
                {
                    var ThisStatus = 
                    {
                        ServerName: servername,
                        ServerStatus: status
                    }
                    resolve(ThisStatus)
                }).catch((error) =>
                {
                    console.log(error)
                    resolve({"ServerName": servername,"ServerStatus": "Unavailable"});
                });
            });
        }
	}
}

module.exports = serverstatus; //<------------ Don't forget this one!