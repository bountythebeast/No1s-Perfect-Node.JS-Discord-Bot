const Command = require("../base/Command.js");
const nodeactyl = require('nodeactyl-v1-support');
const Client = nodeactyl.Client;
const node = require('nodeactyl');
const Application = node.Application;
const PterodactylPanel = require("../data/PterodactylPanel.json");
var stringTable = require('string-table');
const config = require("../config.js")

class startserver extends Command 
{
	constructor (client) 
	{
		super(client, 
		{
			name: "startserver", //command name, should match class.
			description: "Admin command for use with Panel commands.", //description
            usage: "startServer <server name> | leave blank for react. Full list of Options (currently): \n survival,fivem,hub,rsp,relaxedsurvivalplus,skyblock,survivalhub,bungee,creative,factions,stafftest,limbo,login,ark,bo3,blackops,blackops3,cod4", //usage details. Should match the name and class
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
                panelSetup(message).then(temp => switchCase(temp))
                .then(result => 
                    {
                        if(result === "Checking what servers are offline... Please stand by.")
                        {
                            message.channel.send(result+" \n>If you are an admin, you can react to the appropriate offline servers to send a start command.")
                            .then(botmsg => 
                            {
                                Application.getAllServers().then(serverdata =>
                                {
                                    var values = Object.values(serverdata);
                                    const promises = [];
                                    let offlineservers
                                    values.forEach(async(serverdata,index) =>
                                    {
                                        promises.push(isOnline(serverdata.attributes.identifier,serverdata.attributes.name))
                                    });
                                    const offlinewithreactions = [];
                                    Promise.all(promises).then(results =>
                                    {
                                        console.log(results)

                                        offlineservers = results.filter(resultitem => resultitem.ServerStatus === "offline")

                                        console.log(offlineservers)
                                        //message.channel.send("```\n"+stringTable.create(results)+"```")
                                    }).then(() =>
                                    {
                                        if(offlineservers.length > 0)
                                        {
                                            offlineservers.forEach(server =>
                                            { 
                                                getReaction(server,offlinewithreactions)
                                            }) 
                                        }
                                    }).then(() =>
                                    {
                                        const currentreactions = [];
                                        if(offlinewithreactions.length > 0)
                                        {
                                            const promise2 = [];
                                            offlinewithreactions.forEach((item) =>
                                            {
                                                currentreactions.push(item.ThisReaction)
                                                promise2.push(botmsg.react(item.ThisReaction))
                                            });
                                            Promise.all(promise2).then(() =>
                                            {
                                                botmsg.edit(botmsg.cleanContent + "\n```"+stringTable.create(offlinewithreactions)+"```\n>>Bot is currently awaiting a reaction.")
                                                const filter = (reaction,user) => 
                                                {
                                                    return currentreactions.includes(reaction.emoji.name) && ((user.id === message.author.id) || (user.id === message.client.appInfo.owner.id) || config.admins.contains(user.id))//As long as the command author (which requires perms) === reactor, were good.
                                                }
                                                botmsg.awaitReactions(filter, {max: 1, time: 60000, errors: ['time']})
                                                .then(collected => 
                                                {
                                                    const reaction = collected.first();
                                                    console.log(reaction)
                                                    if(currentreactions.includes(reaction.emoji.name))
                                                    {
                                                        offlinewithreactions.forEach(react =>
                                                        {
                                                            if(react.ThisReaction === reaction.emoji.name) 
                                                            {
                                                                try
                                                                {
                                                                    switchCase(react.ServerName.toLowerCase());
                                                                    botmsg.edit(botmsg.cleanContent + "\nStart Command send to "+react.ServerName)
                                                                }
                                                                catch
                                                                {
                                                                    botmsg.edit(botmsg.cleanContent + "\nThere was an error sending start command to "+react.ServerName)
                                                                }
                                                            }
                                                        })
                                                    }
                                                    else
                                                    {
                                                        message.channel.send("Unknown error?")
                                                    }
                                                })
                                                .catch(collected =>
                                                {
                                                    console.log(collected)
                                                    message.channel.send("You reacted with either an invalid emoji or did not react in time.")  
                                                })
                                            });
                                        }
                                        else
                                        {
                                            botmsg.edit(botmsg.cleanContent+"\n\nIt appears there are no servers offline with StartReaction Enabled!")
                                        }
                                        
                                    });
                                }).catch(err =>
                                {
                                    console.log(err); 
                                });
                            })
                        }
                        else
                        {
                            message.channel.send("```"+result+"```")
                        }
                    })
                .catch(error => {console.log("Errors in startServer command. \n"+error)})
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
                function getReaction(name,offlinewithreactions)
                {
                    return new Promise( (resolve) =>
                    {
                        switch(name.ServerName.toLowerCase())
                        {
                            case "creative":
                                var ThisReaction = 
                                {
                                    ServerName: name.ServerName,
                                    ServerStatus: name.ServerStatus,
                                    ThisReaction: "🇨"
                                }
                                offlinewithreactions.push(ThisReaction)
                                resolve()
                                break;
                            case "survival":
                                var ThisReaction = 
                                {
                                    ServerName: name.ServerName,
                                    ServerStatus: name.ServerStatus,
                                    ThisReaction: "🇸"
                                }
                                offlinewithreactions.push(ThisReaction)
                                resolve()
                                break;
                            case "hub":
                                var ThisReaction = 
                                {
                                    ServerName: name.ServerName,
                                    ServerStatus: name.ServerStatus,
                                    ThisReaction: "🇭"
                                }
                                offlinewithreactions.push(ThisReaction)
                                resolve()
                                break;
                            case "fivem":
                                var ThisReaction = 
                                {
                                    ServerName: name.ServerName,
                                    ServerStatus: name.ServerStatus,
                                    ThisReaction: "🇫"
                                }
                                offlinewithreactions.push(ThisReaction)
                                resolve()
                                break;
                            case "relaxed survival plus":
                                var ThisReaction = 
                                {
                                    ServerName: name.ServerName,
                                    ServerStatus: name.ServerStatus,
                                    ThisReaction: "🇷"
                                }
                                offlinewithreactions.push(ThisReaction)
                                resolve()
                                break;
                            case "midnight skyblock":
                                var ThisReaction = 
                                {
                                    ServerName: name.ServerName,
                                    ServerStatus: name.ServerStatus,
                                    ThisReaction: "☁️"
                                }
                                offlinewithreactions.push(ThisReaction)
                                resolve()
                                break;
                            case "survival hub":
                                var ThisReaction = 
                                {
                                    ServerName: name.ServerName,
                                    ServerStatus: name.ServerStatus,
                                    ThisReaction: "🇺"
                                }
                                offlinewithreactions.push(ThisReaction)
                                resolve()
                                break;
                            case "bungeecord backend":
                                var ThisReaction = 
                                {
                                    ServerName: name.ServerName,
                                    ServerStatus: name.ServerStatus,
                                    ThisReaction: "⛓️"
                                }
                                offlinewithreactions.push(ThisReaction)
                                resolve()
                                break;
                            case "midnight classic factions":
                                var ThisReaction = 
                                {
                                    ServerName: name.ServerName,
                                    ServerStatus: name.ServerStatus,
                                    ThisReaction: "🚩"
                                }
                                offlinewithreactions.push(ThisReaction)
                                resolve()
                                break;
                            case "limbo server (login server)":
                                var ThisReaction = 
                                {
                                    ServerName: name.ServerName,
                                    ServerStatus: name.ServerStatus,
                                    ThisReaction: "⛔"
                                }
                                offlinewithreactions.push(ThisReaction)
                                resolve()
                                break;
                            case "midnight ark":
                                var ThisReaction = 
                                {
                                    ServerName: name.ServerName,
                                    ServerStatus: name.ServerStatus,
                                    ThisReaction: "🇦"
                                }
                                offlinewithreactions.push(ThisReaction)
                                resolve()
                                break;
                            case "midnight blops3":
                                var ThisReaction = 
                                {
                                    ServerName: name.ServerName,
                                    ServerStatus: name.ServerStatus,
                                    ThisReaction: "🇧"
                                }
                                offlinewithreactions.push(ThisReaction)
                                resolve()
                                break;
                            case "midnight cod4x server":
                                var ThisReaction = 
                                {
                                    ServerName: name.ServerName,
                                    ServerStatus: name.ServerStatus,
                                    ThisReaction: "⚠️"
                                }
                                offlinewithreactions.push(ThisReaction)
                                resolve()
                                break;   
                            
                            default:
                                resolve(``)
                                break;
                        }
                    });
                }
                function switchCase(processarg)
                {
                    return new Promise( (resolve) =>
                    {
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
                                resolve("Checking what servers are offline... Please stand by.");
                                break;
                        }
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

module.exports = startserver; //<------------ Don't forget this one!