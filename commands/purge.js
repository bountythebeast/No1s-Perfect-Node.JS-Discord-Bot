const Command = require("../base/Command.js");

class purge extends Command 
{
	constructor (client) 
	{
		super(client, 
		{
			name: "purge", //command name, should match class.
			description: "Delete bulk messages (100 Max)", //description
            usage: "purge <All (messages from any user)|@user> <#channel (null for current.)> <number to delete (if blank, try to delete them all.)>", //usage details. Should match the name and class
            aliases: ["clear","delete"],
            guildOnly: true,
            category: "Guild Admin",
            permLevel: "Administrator"
		});
	}

	async run (message, args, level) 
	{
        let morethan = false;
        if(!args[0])
        {
            return message.channel.send("**[⚠WARNING⚠]** This command will delete large amounts of messages. DO NOT USE BY ACCIDENT.**[⚠WARNING⚠]** \n Atleast 1 argument is required for this command. See no1/help purge.")
        }
        if(!args[1])
        {
            args[1] = message.channel
            args[2] = 100;
        } 
        else if(!args[2])
        {
            if(args[1].startsWith('<#') && (args[1].endsWith('>')))
            {
                args[1] = args[1].slice(2,-1);
                args[1] = message.guild.channels.cache.get(args[1])
                args[2] = 100;
            }
            else if(Number(args[1]))
            {
                if(Number(args[1]) > 100)
                {
                    morethan = true;
                    args[2] = 100
                }
                else if(Number(args[1]) < 1)
                {
                    return message.channel.send("**[⚠WARNING⚠]** Cannot delete < 1 message. **[⚠WARNING⚠]** ")
                }
                else
                {
                    args[2] = args[1]
                }
                args[1] = message.channel
            }
        }
        if((typeof args[1] === String) && (args[1].startsWith('<#') && (args[1].endsWith('>'))))
        {
            args[1] = args[1].slice(2,-1);
            args[1] = message.guild.channels.cache.get(args[1])
        }

        if(Number(args[0]))
        {
            args[2] = args[0]
            args[0] = "all"
        }
        if((args[0].toLowerCase() === "all") || (Number(args[0])))
        {
            args[1].messages.fetch(
            {
                limit: args[2]  
            }).then((temp) =>
            {
                const allMessages = [];
                temp.forEach(msg => allMessages.push(msg))
                args[1].bulkDelete(allMessages).then(() =>
                {
                    if(morethan)
                    {
                        message.channel.send(`<@${message.author.id}> Cleared ${args[2]}(max) messages from all users in <#${args[1].id}>`)
                    }
                    else
                    {
                        message.channel.send(`<@${message.author.id}> Cleared ${args[2]} messages from all users in <#${args[1].id}>`)
                    }
                });
            });
        }
        else if(args[0].startsWith('<@') && args[0].endsWith('>'))
        {
            args[0] = args[0].slice(2,-1);
            if(args[0].startsWith('!'))
            {
                args[0] = args[0].slice(1);
            }
            args[1].messages.fetch(
            {
                limit: args[2]  
            }).then((temp) =>
            {
                const deleteMessages = [];
                temp.filter(m => m.author.id === args[0]).forEach(msg => deleteMessages.push(msg));
                args[1].bulkDelete(deleteMessages).then(() =>
                {
                    if(deleteMessages.length)
                    {
                        let username = deleteMessages[0].author.username
                        if(morethan)
                        {
                            message.channel.send(`<@${message.author.id}> Cleared ${deleteMessages.length} (max) messages from ${username} in <#${args[1].id}>`)
                        }
                        else
                        {
                            message.channel.send(`<@${message.author.id}> Cleared ${deleteMessages.length} messages from ${username} in <#${args[1].id}>`)
                        }
                    }
                    else
                    {
                        message.channel.send(`<@${message.author.id}> Cleared 0 messages, No messages were foud by that user in <#${args[1].id}>`)
                    }
                });
            });
        }
	}
}

module.exports = purge; //<------------ Don't forget this one!