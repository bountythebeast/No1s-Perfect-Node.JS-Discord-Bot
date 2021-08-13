module.exports = class 
{
	constructor (client) 
	{
	  this.client = client;
	}
	async run (reaction)
	{
		//if (reaction.me) return; //this has issues because for whatever reason, reaction.me is always true if the bot reacted first?
		reaction.message.channel.messages.fetch(reaction.message.id)
		let message = reaction.message
		const settings = this.client.getSettings(message.guild);
		
		if (reaction.emoji.name == '🎧' && reaction.count > 1)
		{
			message = reaction.message
			if(message.content.includes("youtube.com")|| message.content.includes("youtu.be"))
			{
				console.log("A reaction was added to a Youtube URL")
				if(message.member.voice.channel)
				{
					console.log("User reacted")
					console.log("message:" +message.content)
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
		}
		else
		{
			const command = "updatememberinfo"
			const args = ""
			const level = this.client.permlevel(message);
			const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
			console.log("Updating Member Info")
			cmd.run(message, args, level);
			return;
		}
    };
}