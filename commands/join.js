const Command = require("../base/Command.js");

class join extends Command 
{
	constructor (client) 
	{
		super(client, 
		{
			name: "join", //command name, should match class.
			description: "Tells the bot to join your voice Channel. Precurser for audio commands.", //description
			usage: "Join"
		});
	}

	async run (message, args, level) 
	{
        let voiceChannel = message.member.voice.channel; //this may need to change. It does not update fast enough when a user moves channels.
        if(!voiceChannel)
        {
            return message.channel.send("You need to be in a voice channel to call the bot.");
        }
        if(!voiceChannel.permissionsFor(message.client.user).has("CONNECT") || !voiceChannel.permissionsFor(message.client.user).has("SPEAK"))
        {
            return message.channel.send("I do not have the permissions required to Join or Speak in "+voiceChannel.name+". Please try a different channel, or update my permissions!");
        }
        try
        {
            const connection = await message.member.voice.channel.join();
        }
        catch(err)
        {
            message.channel.send("There was an error when I attempted to join the voice channel. Please try again, or contact an administrator.")
        }

	}
}

module.exports = join; //<------------ Don't forget this one!