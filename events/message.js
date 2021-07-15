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
	if((message.content.toLowerCase() === "hi") || (message.content.toLowerCase() === "hello") || (message.content.toLowerCase() === "ello") || (message.content.toLowerCase() === "hey") || (message.content.toLowerCase() ==="aloha"))
	{
		switch(getRandom(3))
		{
			case 1:
				message.channel.send("Hello!")
				break;
			case 2:
				message.channel.send("o.O New bot who dis?")
				break;
			default:
				message.channel.send("o/")
				break;
		}
	}
	if(message.content.toLowerCase().includes("mornin"))
	{
		switch(getRandom(3))
		{
			case 1:
				message.channel.send("https://tenor.com/view/good-morning-sunshine-sun-sunshine-gif-5358874")
				break;
			case 2:
				message.channel.send("https://stocki.typepad.com/.a/6a00e0097df5fe88330240a51abc54200b-pi")
				break;
			default:
				message.react("🌅")
				break;
		}
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
	if(message.content.toLowerCase().includes("shit"))
	{
		message.react("💩")
	}
	if(message.content.toLowerCase().includes("snowflake"))
	{
		message.channel.send("Okay Boomer ❄")
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
	function getRandom(max) {return Math.floor(Math.random()*max)}
	if(message.content.toLowerCase().includes("general kenobi"))
	{
		if(getRandom(5) === 3)
		{
			message.channel.send("https://tenor.com/view/another-one-for-my-collection-grievous-lightsaber-gif-16775319")			
		}
		else
		{
			message.channel.send("https://tenor.com/view/general-kenobi-turn-around-star-wars-gif-15335963")
		}
	}
	if(message.content.toLowerCase().includes("secret"))
	{
		if(getRandom(3) === 2)
		{
			message.channel.send("https://tenor.com/view/secret-boss-baby-on-the-phone-gif-7991222")
		}
	}
	if(message.content.toLowerCase().includes("new bot who dis"))
	{
		message.reply("OI THATS MY LINE!")
	}
	if(message.content.toLowerCase().includes("good evening"))
	{
		if(getRandom(3) === 2)
		{
			message.channel.send("https://tenor.com/view/good-evening-dracula-happy-halloween-gif-10113031")
		}
	}
	if(message.content.toLowerCase().includes("bubble wrap"))
	{
		message.channel.send(`**BubbleWrap Delivery** Enjoy 
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

	//if a youtube link is sent, bot reacts with 🎧 and within 60 seconds, a user can react with it to have the bot attempt to play this song.
	if(message.content.includes("youtube.com")|| message.content.includes("youtu.be"))
	{
		//if message is a youtube url, react with 🎧. If reacted with, bot will join vc and begin playing song
		message.react('🎧')
		/*.then(() => //This was commented out due to it failing in production environment... Caused the unintentional bug (or feature) that when you paste a youtube link while in a vc the bot auto joins.
		{
			//filter out bot reactions.
			const filter = (reaction) => 
			{
				return reaction.emoji.name == '🎧'// && reaction.author.bot //<- may need to get this working if a second bot adopts this.
			}
			console.log("A reaction was added to a Youtube URL")
			message.awaitReactions(filter, {max: 1, time: 60000, errors: ["time"]})
			.then(collected => 
			{
				if(collected.first().emoji.name == '🎧')
				{
					if(message.member.voice.channel)
					{
						console.log("User reacted")
						message.content = settings.prefix + "play "+message.content 
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
			}).catch(() =>
			{
				Console.log("Reaction Timeout.")
			})
		})
		*/		
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
