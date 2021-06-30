const Command = require("../base/Command.js");
var fs = require ('fs').promises;
var datapath = "./data/panelusers.json"
const nodeactyl = require('nodeactyl-v1-support')
const node = nodeactyl.Client
const PterodactylPanel = require("../data/PterodactylPanel.json");
class panelsync extends Command 
{
	constructor (client) 
	{
		super(client, 
		{
			name: "panelsync", //command name, should match class.
			description: "Use this command to sync your Discord UID (unique ID) with a panel key \n To get an API key, Sign into the panel and click the 'head' icon in the top right. Give it a description, and hit create. Paste the **FULL** key after the command.  ", //description
			usage: "panelsync <Panel API Key>", //usage details. Should match the name and class
			aliases: ["apisync"]
		});
	}

	async run (message, args, level) 
	{ // eslint-disable-line no-unused-vars
        if(message.guild === null)
        {
            let datatofile = [];
            let paneluserdata = undefined
            let APIKey = undefined
            let KeyExists = false;
            try
            {
                let data = await fs.readFile(datapath).catch((err)=> console.error('Failed to read file',err));
                console.log("\n\n\n data: "+data + "\n\n\n")
                if((data.length>0) && (data !== null))
                {
                    paneluserdata = await JSON.parse(data);
                }
            }
            catch(err)
            {
                console.log("Error in panelsync... "+err)
                message.channel.send("There was an error, Please try your command again or contact an admin.")
            }
            if(args[0] == undefined) //this isn't really working yet.
            {
                if(paneluserdata)
                {
                    for (let messagedata of Object.values(paneluserdata))
                    {
                        if(messagedata.DiscordID === message.author.id)
                        {
                            APIKey = messagedata.APIKey
                            message.channel.send("Your discord is linked to: \"**"+APIKey.substring(0,16)+"\"** First 16 digis for security reasons. This is what appears in the panel!")
                        }
                    }
                }
            }
            else
            {
                if(args[0].length != 48)
                {
                    message.channel.send("Error, the APIKey should be 48 characters. Please make sure there are no spaces, or carriage returns.")
                }
                else
                {
                    APIKey = args[0]
                    node.login(PterodactylPanel.HOST,APIKey, (logged_in, msg) => 
                    {
                        message.channel.send("Host/APIkey pair worked: "+logged_in)
			            console.log("Host/APIKey pair worked: "+logged_in); // return a Boolean (true/false) if logged in.
			            if(!logged_in) {console.error(msg)}
                        if(logged_in)
                        {
                            if(paneluserdata)
                            {

                                let tempdata = []
                                for (let messagedata of Object.values(paneluserdata))
                                {
                                    if(messagedata.DiscordID === message.author.id)
                                    {
                                        KeyExists = true;
                                    }
                                    else
                                    {
                                        tempdata.push(messagedata)
                                    }
                                }
                            }
                            if(KeyExists)
                            {
                                var updatepanelusers = JSON.stringify(tempdata); //may need to stringify above, not here?
                                fs.writeFile(datapath, updatepanelusers, function(err)
                                {
                                    if(err)
                                    {
                                        console.log('There was an error updating user APIKey...');
                                        message.channel.send("There was an error updating your APIKey. Check console.")
                                        console.log(err.message);
                                    }
                                });
                            }
                            else
                            {
                                //user does not exist in panelusers.json
                                var newPanelUser = {
                                    DiscordID: message.author.id,
                                    APIKey: APIKey
                                };
                                
                                if((paneluserdata === undefined) || (paneluserdata === null))
                                {
                                    datatofile = newPanelUser;
                                }
                                else
                                {
                                    try
                                    {
                                        datatofile.push(newPanelUser)
                                    }
                                    catch(errors)
                                    {
                                        console.error(errors)
                                    }
                                }
                                var paneldata = JSON.stringify(datatofile);
                                fs.writeFile(datapath, paneldata, function(err)
                                {
                                    if(err)
                                    {
                                        console.log('There was an error saving APIKey configuration to file...');
                                        message.channel.send("Error setting APIKey! Sorry, error data has been stripped. Check console.")
                                        console.log(err.message);
                                        return;
                                    }
                                });
                            }
                        }
                        else
                        {
                            message.channel.send("It appears that key was invalid! Please make sure there were no extra spaces, that it was coppied correctly, and that it is still active!")
                            console.log(message.author + " Attempted to use API key: "+APIKey+" which didn't work!")
                        }
                    });
                }

            }
        }
        else
        {
            message.delete()
            message.channel.send("Error, this is a DM only command for security reasons! DO NOT share your access key with ANYONE!")
        }
	}
}

module.exports = panelsync; //<------------ Don't forget this one!
