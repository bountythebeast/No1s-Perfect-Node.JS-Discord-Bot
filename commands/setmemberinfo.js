const Command = require("../base/Command.js");
var fs = require ('fs').promises;
var datapath = "./data/memberdata.json"
class setmemberinfo extends Command 
{
    constructor (client) {
        super(client, {
            name: "setmemberinfo", //command name, should match class.
            description: "This is a command to update the member info. It will update the channel name accordingly", //description
            usage: "setmemberinfo <ChannelID> <Format:> <roleid> (Leave RoleID null to use Total User count. Excluding bots!)",//usage details. Should match the name and class
            permLevel: "Administrator",
            category: "Guild Admin"
        });
    }

    async run (message, args, level) 
    {
        if(!args[1])
        {
            message.channel.send("Error, requires atleast 2 arguments. \n Usage: setmemberinfo <ChannelID> <Format:> <roleid> (Leave RoleID null to use Total User Count.)")
        }
        else
        {
            let memberinfodata = undefined
            let RoleID = undefined
            if(args[2])
            {
                RoleID = args[2]
            }
            else
            {
                RoleID = null //member count
            }
            
            let ChannelID = args[0]
            let channelname = args[1]
            let GuildId = message.guild.id
            let datatofile = [];
            console.log("GuildId:"+GuildId)
            console.log("ChannelID:"+ ChannelID)
            try
            {
                let data = await fs.readFile(datapath).catch((err)=> console.error('Failed to read file',err));
                console.log("\n\n\n data: "+data + "\n\n\n")
                if((data.length>0) && (data !== null))
                {
                    memberinfodata = await JSON.parse(data);
                }
                if(memberinfodata)
                {
                    for (let messagedata of Object.values(memberinfodata))
                    {
                        if(messagedata.Channel === ChannelID)
                        {
                            UpdateChannel = true;
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
            }
            var newMemberInfo = {
                Guild: GuildId,
                Channel: ChannelID,
                Role: RoleID,
                channelname: channelname
            };
            if((memberinfodata === undefined) || (memberinfodata === null))
            {
                datatofile = newMemberInfo;
            }
            else
            {
                try
                {
                    datatofile.push(newMemberInfo)
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
                    console.log('There was an error saving MemberInfo configuration to file...');
                    message.channel.send("Error setting MemberInfo message! Sorry, error data has been stripped. Check console.")
                    console.log(err.message);
                    return;
                }
            });
            message.channel.send("Added new MemberInfo message: \""+newMemberInfo.channelname+"\"")
        }
    }
}

module.exports = setmemberinfo;