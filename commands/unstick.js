const Command = require("../base/Command.js");
const stickymessage = require("./stickymessage.js");
var fs = require ('fs').promises;
var datapath = "./data/stickymessages.json"
class unstick extends Command 
{
    constructor (client) {
        super(client, {
            name: "unstick", //command name, should match class.
            description: "This command is used to Unstick, a sticky message. Should be run in the same channel as an existing sticky message.", //description
            usage: "unstick",//usage details. Should match the name and class
            category: "Guild Admin",
            permLevel: "Administrator"
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
        if (args[0])
        {
            message.channel.send("Error, unstick does not accept parameters as this time. Mentioning a channel with a sticky message has not been coded yet.")
        }
        else
        {
            let GuildId = message.guild.id
            let ChannelId = message.channel.id
            let StickyExists = false
            try
            {
                let data = await fs.readFile(datapath).catch((err)=> console.error('Failed to read file',err));
                if(data.length>0)
                {
                    stickymessagedata = await JSON.parse(data);
                }
                if(stickymessagedata)
                {
                    let tempdata = [];
                    for (let messagedata of Object.values(stickymessagedata))
                    {
                        if(messagedata.Channel === ChannelId)
                        {
                            StickyExists = true;
                        }
                        else
                        {
                            //tempdata.push(JSON.stringify(stickymessagedata))
                            tempdata.push(messagedata) //may need to stringify here, not below?
                        }
                    }
                    if(StickyExists)
                    {
                        var stickyData = JSON.stringify(tempdata); //may need to stringify above, not here?
                        fs.writeFile(datapath, stickyData, function(err)
                        {
                            if(err)
                            {
                                console.log('There was an error saving sticky configuration to file...');
                                message.channel.send("Error removing sticky message! Sorry, error data has been stripped. Check console.")
                                console.log(err.message);
                            }
                        });
                    }
                 }
            }
            catch (err)
            {
                console.log("There was an error, error:")
                console.log(err)
                //this is just to make sure the script doesn't throw an error if the file doesn't exist.
                console.log("error in read file...")
                StickyExists = false
            }
            if(!StickyExists)
            {
                message.channel.send("Sorry, There appears to be no sticky message for this channel logged.")
            }
            else
            {
                message.channel.send("Sticky message has been removed from this channel!")
            }
        }
    }
}

module.exports = unstick;
