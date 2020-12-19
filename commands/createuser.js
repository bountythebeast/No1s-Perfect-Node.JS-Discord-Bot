const Command = require("../base/Command.js");
const node = require('nodeactyl')
const Application = node.Application;
const PterodactylPanel = require("../data/PterodactylPanel.json");

class createuser extends Command 
{
	constructor (client) 
	{
		super(client, 
		{
			name: "createuser", //command name, should match class.
			description: "This is to create a user account on the panel. DM ONLY.", //description
            usage: "createuser <email> <password>", //usage details. Should match the name and class
            category: "System"
		});
	}

	async run (message, args, level) 
	{
        if(message.guild === null)
        {
            //continue
            if(args[0] && args[1])
            {
                if(args[0].includes('@') && args[0].includes('.'))
                {
                    if(args[2])
                    {
                        message.channel.send("Error, spaces are not allowed. This is for security purposes with the bot.")
                    }
                    let username = message.author.id.toString()
                    let password = args[1].toString()
                    let email = args[0].toString()
                    let firstname = message.author.username.toString()
                    let lastname = "#"+message.author.discriminator.toString()
                    Application.login(PterodactylPanel.HOST,PterodactylPanel.UserAPI,(logged_in,err) =>
                    {
                        if(logged_in)
                        {
                            console.log(logged_in)
                            Application.createUser(username,password,email,firstname,lastname,false,"en").then(user =>
                            {
                                console.log(user)
                                message.channel.send("Your user was created! You can log in with your email and password by navigating to: \n https://panel.midnightgg.com ! Welcome aboard!\nPlease note, Your 'username' is your discord Snowflake* ID. This is to prevent abuse, but you may change this at any time from the panel. \n >> Please note, Changing your username will disable panel bot commands for you!")
                            })
                            .catch(err =>
                            {
                                console.log(err)
                                message.channel.send("There was an error creating your account. Please contact an Administrator.")
                            })
                        }
                        else if(err)
                        {
                            console.log(err)
                            message.channel.send("There was an error connecting to the panel, Please contact an Administrator.")
                        }
                        else
                        {
                            console.log("No information error.")
                            message.channel.send("There was an error connecting to the panel, Please contact an Administrator.")
                        }
                    })
                }
                else
                {
                    message.channel.send("Error, your first argument must be an email! This will be strictly used for recovery purposes, and signing in!")
                }
            }
            else
            {
                message.channel.send("Error, This command requires 2 arguments. It will automatically fill the rest of the data.")
            }
            
        }
        else
        {
            message.delete()
            message.author.send("Please use the createuser command here, in DMs. We don't want others to see your password.")
            message.channel.send("⚠️ DO NOT USE THIS COMMAND OUTSIDE OF DMs ⚠️")
        }
		
	}
}

module.exports = createuser; //<------------ Don't forget this one!
