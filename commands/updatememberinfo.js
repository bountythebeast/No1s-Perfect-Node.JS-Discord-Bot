const Command = require("../base/Command.js");
var fs = require ('fs').promises;
var datapath = "./data/memberdata.json"
class updatememberinfo extends Command 
{
    constructor (client) {
        super(client, {
            name: "updatememberinfo", //command name, should match class.
            description: "This is a command to update the member info. It will update the channel name accordingly", //description
            usage: "updatememberinfo",//usage details. Should match the name and class
            permLevel: "Administrator",
            category: "Guild Admin"
        });
    }

    async run (message, args, level) 
    {
        let data = await fs.readFile(datapath).catch((err)=> console.error('Failed to read file',err));
        let memberdata
        if((data.length>0) && (data !== null))
        {
            memberdata = await JSON.parse(data);
        }
        if(memberdata)
        {
            for (let messagedata of Object.values(memberdata))
            {
                if(messagedata.Guild === message.guild.id)
                {
                    let rolenumber
                    if(messagedata.Role !== null)
                    {
                        rolenumber = await message.guild.roles.cache.get(messagedata.Role).members.size
                    }
                    else
                    {
                        rolenumber = message.guild.members.cache.filter(member => !member.user.bot).size;
                    }
                    message.guild.channels.cache.get(messagedata.Channel).setName(`${messagedata.channelname} ${rolenumber}`)
                    //message.channel.send(`[DEBUG] Attempting to update: ${messagedata.channelname} with ${messagedata.channelname} ${rolenumber}`)
                }
            }
        }
    }
}

module.exports = updatememberinfo;