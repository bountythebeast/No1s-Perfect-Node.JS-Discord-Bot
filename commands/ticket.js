const Command = require("../base/Command.js");

class ticket extends Command 
{
	constructor (client) 
	{
		super(client, 
		{
			name: "ticket", //command name, should match class.
			description: "An example command for quickly creating more commands", //description
			usage: "ticket", //usage details. Should match the name and class
			aliases: ["notarealcommand"]
		});
	}

	async run (message, args, level) 
	{ // eslint-disable-line no-unused-vars
		try 
		{
			message.channel.send("You ran an example command! Why...?");
		} catch (e) 
		{
			console.log(e);
		}
	}
}

module.exports = ticket; //<------------ Don't forget this one!


/* Notes
Discord bot would ask person for different things
(for billing purposes) & panel usage
First & Last name
Email:
Password:

Tell the user of the standard packages that we offer (currently one)
(yes) (no) (reaction based)  (after would list out different packages for sale, and a (build your own server option resulting in below questions)


How many cores would you like to allocate to your server?
(text based)

How much ram would you like to allocate to your server?
(text based)
How much storage space would you like to allocate to your server?
(text based)


(if package is chosen, create the account with afore asked for name, email & password, and create the packaged server)
(create paypal invoice based off of name, email, and package details, and if not payed in 3 days, suspend the server)
*/