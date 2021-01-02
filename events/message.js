// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

const stickymessage = require('../commands/stickymessage');

module.exports = class {
  constructor (client) {
	this.client = client;
  }

  async run (message) {

	// It's good practice to ignore other bots. This also makes your bot ignore itself
	//  and not get into a spam loop (we call that "botception").
	if (message.author.bot) return;

	// Cancel any attempt to execute commands if the bot cannot respond to the user.
	if (message.guild && !message.channel.permissionsFor(message.guild.me).missing("SEND_MESSAGES")) return;
	
	// Grab the settings for this server from the Enmap
	// If there is no guild, get default conf (DMs)
	const settings = this.client.getSettings(message.guild);

	// For ease of use in commands and functions, we'll attach the settings
	// to the message object, so `message.settings` is accessible.
	message.settings = settings;


	// Checks if the bot was mentioned, with no message after it, returns the prefix.
	const prefixMention = new RegExp(`^<@!?${this.client.user.id}> ?$`);
	if (message.content.match(prefixMention)) {
		return message.reply(`My prefix on this guild is \`${settings.prefix}\``);
	}

	if(message.content.toLowerCase().includes("yeet"))
	{
		message.channel.send("https://tenor.com/view/lion-king-throwing-off-a-cliff-simba-gif-5583349");
	}
	if(message.content.toLowerCase() == "neat.")
	{
		message.channel.send("https://tenor.com/view/caboose-rv-b-neat-gif-11552229");
	}
	if(message.content.toLowerCase().includes("hello there"))
	{
		message.channel.send("https://tenor.com/view/hello-there-hi-there-greetings-gif-9442662")
	}
	if(message.content.toLowerCase().includes("bug"))
	{
		message.channel.send("https://ih1.redbubble.net/image.1302208043.6186/fposter,small,wall_texture,product,750x1000.jpg")
	}
	if((message.content.toLowerCase() == "o/") || (message.content.toLowerCase() == "\\\o"))
	{
		if(message.content.toLowerCase() == "o/")
			message.channel.send("\\\o")
		else
		{
			message.channel.send("o/")
		}
	}
	function getRandom(min,max) {return Math.random() * (max-min)+min}
	if(message.content.toLowerCase().includes("general kenobi"))
	{
		if(getRandom(1,5) === 3)
		{
			message.channel.send("https://tenor.com/view/another-one-for-my-collection-grievous-lightsaber-gif-16775319")			
		}
		else
		{
			message.channel.send("https://tenor.com/view/general-kenobi-turn-around-star-wars-gif-15335963")
		}
	}

	// Also good practice to ignore any message that does not start with our prefix,
	// which is set in the configuration file.
	if (message.content.indexOf(settings.prefix) !== 0) 	
	//testing...
	{
		var fs = require ('fs').promises;
		var datapath = "./data/stickymessages.json"
		let data = await fs.readFile(datapath).catch((err)=> console.error('Failed to read file',err));
		let stickymessagedata
		let sticky
		let previousStickyId
		let GuildId = message.guild.id
		let ChannelId = message.channel.id
		let newstickyfiledata = [];
		let thestickymessagedata
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
					thestickymessagedata = messagedata
					sticky = messagedata.RepostMessage
				}
				else // why?
				{
					newstickyfiledata.push(messagedata)
				}
			}
			if(sticky)
			{
				if(thestickymessagedata.PreviousSticky)
				{
					try
					{
						message.channel.messages.fetch(thestickymessagedata.PreviousSticky).then(msg => msg.delete())
					}
					catch(errorsss)
					{
						console.error(errorsss)
					}
				}
				previousStickyId = (await message.channel.send("📌STICKY MESSAGE📌 \n"+sticky)).id
				var newStickyMessage = {
					Guild: GuildId,
					Channel: ChannelId,
					RepostMessage: sticky,
					PreviousSticky: previousStickyId
				};
				newstickyfiledata.push(newStickyMessage)
				var stickyData = JSON.stringify(newstickyfiledata);
				fs.writeFile(datapath, stickyData, function(err)
				{
					if(err)
					{
						console.log('There was an error saving sticky configuration to file...');
						message.channel.send("Error with sticky messages! Sorry, error data has been stripped. Check console.")
						console.log(err.message);
						return;
					}
				});
			}
		}
	}

/*
botmsg.edit(botmsg.cleanContent + "\n```"+stringTable.create(offlinewithreactions)+"```\n>>Bot is currently awaiting a reaction.")
const filter = (reaction,user) => 
{
	return currentreactions.includes(reaction.emoji.name) && ((user.id === message.author.id) || (user.id === message.client.appInfo.owner.id) || config.admins.contains(user.id))//As long as the command author (which requires perms) === reactor, were good.
}
botmsg.awaitReactions(filter, {max: 1, time: 60000, errors: ['time']})
.then(collected => 
{
*/

	//if a youtube link is sent, bot reacts with 🎧 and within 60 seconds, a user can react with it to have the bot attempt to play this song.
	if(message.content.includes("youtube.com")|| message.content.includes("youtu.be"))
	{
		//if message is a youtube url, react with 🎧. If reacted with, bot will join vc and begin playing song
		message.react('🎧')
		.then(() =>
		{
			message.awaitReactions((reaction) => reaction.emoji.name == '🎧', {max: 1, time: 60000})
			.then(collected => 
			{
				if(collected.first().emoji.name == '🎧')
				{
					if(message.member.voice.channel)
					{
						message.content = settings.prefix + "play "+message.content 
						console.log(message.content) //i want to see if it is prefix/play url or not considering the read-only is just the url.
						const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
						const command = args.shift().toLowerCase();
						const level = this.client.permlevel(message);
						const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
						this.client.logger.log(`${this.client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, "cmd");
						cmd.run(message, args, level);
					}
					else
					{
						message.channel.send("Hey! The emoji 🎧 is an automated emoji to let me join a VC and play that song! But you need to be in a voice Channel to use it!")
					}
				}
			})
		})
		
	}

	if (message.content.indexOf(settings.prefix) !== 0) return;

	// Here we separate our "command" name, and our "arguments" for the command.
	// e.g. if we have the message "+say Is this the real life?" , we'll get the following:
	// command = say
	// args = ["Is", "this", "the", "real", "life?"]
	const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();


	// If the member on a guild is invisible or not cached, fetch them.
	//if (message.guild && !message.member) await message.guild.fetchMember(message.author);

	// Get the user or member's permission level from the elevation
	const level = this.client.permlevel(message);

	// Check whether the command, or alias, exist in the collections defined
	// in app.js.
	const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
	// using this const varName = thing OR otherthign; is a pretty efficient
	// and clean way to grab one of 2 values!
	if (!cmd) return;


	// Some commands may not be useable in DMs. This check prevents those commands from running
	// and return a friendly error message.
	if (cmd && !message.guild && cmd.conf.guildOnly)
	  return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

	if (level < this.client.levelCache[cmd.conf.permLevel]) {
	  if (settings.systemNotice === "true") {
		return message.channel.send(`You do not have permission to use this command. Your permission level is ${level} (${this.client.config.permLevels.find(l => l.level === level).name}) This command requires level ${this.client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
	  } else {
		return;
	  }
	}
	  
	// To simplify message arguments, the author's level is now put on level (not member, so it is supported in DMs)
	// The "level" command module argument will be deprecated in the future.
	message.author.permLevel = level;

	message.flags = [];
	while (args[0] &&args[0][0] === "-") {
	  message.flags.push(args.shift().slice(1));
	}
	
	// If the command exists, **AND** the user has permission, run it.
	this.client.logger.log(`${this.client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, "cmd");
	cmd.run(message, args, level);
  }
};
