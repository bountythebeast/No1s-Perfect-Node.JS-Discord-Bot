const Command = require("../base/Command.js");

class bubblewrapgenerator extends Command 
{
	constructor (client) 
	{
		super(client, 
		{
			name: "bubblewrapgenerator", //command name, should match class.
			description: "Generates a bubblewrap sheet for your popping pleasure.", //description
			usage: "bubblewrapgenerator \#across, \#down" //usage details. Should match the name and class
		});
	}

	async run (message, args, level) 
	{ // eslint-disable-line no-unused-vars
        if(!args[0])
        {
            message.channel.send(`**BubbleWrap Delivery** (Default) 
||POP||||POP||||POP||||POP||||POP||||POP||||POP||||POP||
||POP||||POP||||POP||||POP||||POP||||POP||||POP||||POP||
||POP||||POP||||POP||||POP||||POP||||POP||||POP||||POP||
||POP||||POP||||POP||||POP||||POP||||POP||||POP||||POP||
||POP||||POP||||POP||||POP||||POP||||POP||||POP||||POP||
||POP||||POP||||POP||||POP||||POP||||POP||||POP||||POP||
||POP||||POP||||POP||||POP||||POP||||POP||||POP||||POP||
||POP||||POP||||POP||||POP||||POP||||POP||||POP||||POP||
||POP||||POP||||POP||||POP||||POP||||POP||||POP||||POP||
||POP||||POP||||POP||||POP||||POP||||POP||||POP||||POP||
||POP||||POP||||POP||||POP||||POP||||POP||||POP||||POP||`)
        }
        else if(!args[1])
        {
            message.channel.send("Error, you can't provide a single value!")
        }
        else
        {
            if((parseInt(args[0])) && (parseInt(args[1])))
            {
                let outputline = ""
                for(let i2=0;i2<args[1];i2++)
                {
                    for(let i=0;i<args[0];i++)
                    {
                        outputline += "||POP||"
                    }
                    outputline += "\n"
                }
                console.log(outputline.length)
                if(outputline.length > 1999)
                {
                    message.channel.send("While i'd love to provide you with that massive bubble wrap sheet, Discord™ limits me to 2,000 Characters.")
                }
                else
                {
                    message.channel.send(outputline)
                }
                
            }
            else
            {
                message.channel.send("Parsing error, please provide Numbers.")
            }
        }
	}
}

module.exports = bubblewrapgenerator; //<------------ Don't forget this one!
