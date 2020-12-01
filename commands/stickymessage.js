const Command = require("../base/Command.js");
var fs = require ('fs').promises;
var datapath = "./data/stickymessages.json"
class stickymessage extends Command 
{
    constructor (client) {
        super(client, {
            name: "stickymessage", //command name, should match class.
            description: "Causes the message to be sticky until the command 'unstick' is run. It will delete and repost its message whenever a new message is sent.", //description
            usage: "stickymessage <message to be sticky>",//usage details. Should match the name and class
            permLevel: "Administrator",
            aliases: ["stick", "sticky", "pin", "glue"]
        });
    }

    /* Notes.
- This is not done yet... obviously...
- Needs to have some modification to index or command... on message check if server has any sticky messages, if yes, does that channel have any, if yes, repost.
https://stackoverflow.com/questions/61554499/discord-sticky-command could be useful, may not be.
    */

    async run (message, args, level) 
    {
        let stickymessagedata = undefined
        if (!args[0])
        {
            message.channel.send("Error, stickymessage requires a message to become sticky!")
        }
        else
        {
            let messageToStick = args.join(' ');
            let GuildId = message.guild.id
            let ChannelId = message.channel.id
            let StickyExists = false
            let datatofile = [];

            try
            {
                let data = await fs.readFile(datapath).catch((err)=> console.error('Failed to read file',err));
                console.log("\n\n\n data: "+data + "\n\n\n")
                if((data.length>0) && (data !== null))
                {
                    stickymessagedata = await JSON.parse(data);
                }
                if(stickymessagedata)
                {
                    for (let messagedata of Object.values(stickymessagedata))
                    {
                        if(messagedata.Channel === ChannelId)
                        {
                            StickyExists = true;
                        }
                        else
                        {
                            datatofile.push(messagedata)
                        }
                    }
                }
            }
            catch (err)
            {
                console.log("There was an error, error:")
                console.log(err)
                //this is just to make sure the script doesn't throw an error if the file doesn't exist.
                console.log("error in read file... not a big deal tbh. Could not exist, or be null.")
                StickyExists = false
            }
            if(!StickyExists)
            {
                console.log("GuildId:"+GuildId)
                console.log("ChannelId:"+ ChannelId)
                var newStickyMessage = {
                    Guild: GuildId,
                    Channel: ChannelId,
                    RepostMessage: messageToStick,
                    previousStickyId: undefined
                };
                if((stickymessagedata === undefined) || (stickymessagedata === null))
                {
                    datatofile = newStickyMessage;
                }
                else
                {
                    try
                    {
                       datatofile.push(newStickyMessage)
                    }
                    catch(errors)
                    {
                        console.error(errors)
                    }
                }
                var stickyData = JSON.stringify(datatofile);
                fs.writeFile(datapath, stickyData, function(err)
                {
                    if(err)
                    {
                        console.log('There was an error saving sticky configuration to file...');
                        message.channel.send("Error setting sticky message! Sorry, error data has been stripped. Check console.")
                        console.log(err.message);
                        return;
                    }
                });
                message.channel.send("Added new sticky message: \""+newStickyMessage.RepostMessage + "\"\n \n To undo, run the unstick command!")
            }
            else
            {
                message.channel.send("Sorry, a sticky message already exists for this channel! Please run the unstick command in this channel before setting a new sticky message!");
            }
        }
    }
}

module.exports = stickymessage;
