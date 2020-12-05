const Command = require("../base/Command.js");
const ytdl = require('ytdl-core');
var stringTable = require('string-table');

class music extends Command 
{
	constructor (client) 
	{
		super(client, 
		{
			name: "music", //command name, should match class.
			description: "The catch all for music commands. Everything else is an alis of this.", //description
			usage: "Play <song> (immediate, skips current), skip (skip current), pause (pauses music), stop (bot leaves channel, clears queue), clear (clears queue), restart (restarts current song), Leave (bot leaves vc), List (current Queue)", 
			aliases: ["play","skip","pause","stop","clear","queue","restart","leave","list"]
		});
	}

	async run (message, args, level) 
	{
        //retrieve which music command is being run
        let messagestring = message.content.toString();
        if(!messagestring.includes(" "))
        {
            messagestring = messagestring.substring(messagestring.indexOf("/")+1)
        }
        else
        {
            messagestring = messagestring.substring(messagestring.indexOf("/")+1,messagestring.indexOf(" ")) //this is the sub command.
        }
        //create queue
        const serverQueue = queue.get(message.guild.id);

        if (message.content.startsWith(`no1test/play`)) 
        {
            execute(message, serverQueue);
            return;
        }
            else if (message.content.startsWith(`no1test/skip`)) 
        {
            skip(message, serverQueue);
            return;
        }
            else if (message.content.startsWith(`no1test/stop`)) 
        {
            stop(message, serverQueue);
            return;
        }
        else 
        {
            message.channel.send("You need to enter a valid command!");
        }
        async function execute(message, serverQueue) {
            const args = message.content.split(" ");
          
            const voiceChannel = message.member.voice.channel;
            if (!voiceChannel)
              return message.channel.send(
                "You need to be in a voice channel to play music!"
              );
            const permissions = voiceChannel.permissionsFor(message.client.user);
            if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
              return message.channel.send(
                "I need the permissions to join and speak in your voice channel!"
              );
            }
          
            const songInfo = await ytdl.getInfo(args[1]);
            const song = {
                  title: songInfo.videoDetails.title,
                  url: songInfo.videoDetails.video_url,
             };
          
            if (!serverQueue) {
              const queueContruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true
              };
          
              queue.set(message.guild.id, queueContruct);
          
              queueContruct.songs.push(song);
          
              voiceChannel.join().then(connection => 
                {
                    connection.play(message.guild, queueContruct.songs[0])
                });

              try {
                var connection = await voiceChannel.join();
                queueContruct.connection = connection;
                play(message.guild, queueContruct.songs[0]);
              } catch (err) {
                console.log(err);
                queue.delete(message.guild.id);
                return message.channel.send(err);
              }
            } else {
              serverQueue.songs.push(song);
              return message.channel.send(`${song.title} has been added to the queue!`);
            }
          }
          
          function skip(message, serverQueue) {
            if (!message.member.voice.channel)
              return message.channel.send(
                "You have to be in a voice channel to stop the music!"
              );
            if (!serverQueue)
              return message.channel.send("There is no song that I could skip!");
            serverQueue.connection.dispatcher.end();
          }
          
          function stop(message, serverQueue) {
            if (!message.member.voice.channel)
              return message.channel.send(
                "You have to be in a voice channel to stop the music!"
              );
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
          }
          
          function play(guild, song) {
            const serverQueue = queue.get(guild.id);
            if (!song) {
              serverQueue.voiceChannel.leave();
              queue.delete(guild.id);
              return;
            }
          
            const dispatcher = serverQueue.connection
              .play(ytdl(song.url))
              .on("finish", () => {
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
              })
              .on("error", error => console.error(error));
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
            serverQueue.textChannel.send(`Start playing: **${song.title}**`);
          }


        /*
        switch(messagestring.toLowerCase()) //may have to remove 'return's, switch statements don't play nice with them.
        {
            case "play":
                let voiceChannel = message.member.voice.channel; //this may need to change. It does not update fast enough when a user moves channels.
                if(!voiceChannel)
                {
                    //message.channel.send("You need to be in a voice channel to play music, sorry!");
                    return message.channel.send("You need to be in a voice channel to play music, sorry!");
                }
                let permissions = voiceChannel.permissionsFor(message.client.user);
                if(!permissions.has("CONNECT") || !permissions.has("SPEAK"))
                {
                    //message.channel.send("I do not have the permissions required to Join or Speak in "+voiceChannel.name+". Please try a different channel, or update my permissions!");
                    return message.channel.send("I do not have the permissions required to Join or Speak in "+voiceChannel.name+". Please try a different channel, or update my permissions!");
                }
                const songInfo = await ytdl.getInfo(args[0]);
                const song = 
                {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                };
                if(!serverQueue) //may need to change, as we have a command to queue seperately.
                {
                    const queueContract = 
                    {
                        textChannel: message.channel,
                        voiceChannel: voiceChannel,
                        connection: null,
                        songs: [],
                        volume: 5,
                        playing: true,
                    };
                    queue.set(message.guild.id, queueContract);
                    queueContract.songs.push(song);
                    try
                    {
                        console.log("Trying to Join VC");
                        const connection = await message.member.voice.channel.join(); //removed await from connection = await voiceChannel.join();
                        console.log("Joined VC");// never makes it here, fails to return awaited call even though it does join.
                        queueContract.connection = connection;
                        play(message.guild, queueContract.songs[0]);
                    }
                    catch (err)
                    {
                        console.log("Error in MusicBot `Play` command try block.")
                        console.error(err)
                        queue.delete(message.guild.id);
                        message.member.voice.channel.leave();
                        message.channel.send("Seems there was an error with that command. We stripped the data, error visible in console. Please try again.");
                        //return message.channel.send("Seems there was an error with that command. We stripped the data, error visible in console. Please try again.");
                    }
                }
                else
                {
                    serverQueue.songs = [];
                    serverQueue.songs.push(song);
                    console.log(serverQueue.songs);
                    message.channel.send(`${song.title} is playing now.`); //need to update this later to clear queue then play.
                    //return message.channel.send(`${song.title} is playing now.`); //need to update this later to clear queue then play.
                }
                //return message.channel.send("[DEBUG]: Bot has the rights to join and speak.") //remove this when done.
                break; //required.
            case "skip":
                skip(message,serverQueue);
                break;
            case "pause":
                serverQueue.connection.dispatcher.pause();
                break;
            case "stop":
                stop(message, serverQueue);
                break;
            case "clear":
                serverQueue.songs = [];
                message.channel.send("Queue has been cleared.");
                break;
            case "queue":
                //check if bot is in vc already before this so you don't have to be in a vc with the bot to queue things?

                voiceChannel = message.member.voice.channel; //this may need to change. It does not update fast enough when a user moves channels.
                if(!voiceChannel)
                {
                    message.channel.send("You need to be in a voice channel to play music, sorry!");
                    //return message.channel.send("You need to be in a voice channel to play music, sorry!");
                }
                permissions = voiceChannel.permissionsFor(message.client.user);
                if(!permissions.has("CONNECT") || !permissions.has("SPEAK"))
                {
                    message.channel.send("I do not have the permissions required to Join or Speak in "+voiceChannel.name+". Please try a different channel, or update my permissions!");
                    //return message.channel.send("I do not have the permissions required to Join or Speak in "+voiceChannel.name+". Please try a different channel, or update my permissions!");
                }
                songInfo = await ytdl.getInfo(args[0]);
                song = 
                {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                };
                if(!serverQueue) //may need to change, as we have a command to queue seperately.
                {
                    const queueContract = 
                    {
                        textChannel: message.channel,
                        voiceChannel: voiceChannel,
                        connection: null,
                        songs: [],
                        volume: 5,
                        playing: true,
                    };
                    queue.set(message.guild.id, queueContract);
                    queueContract.songs.push(song);
                    try
                    {
                        var connection = await voiceChannel.join();
                        queueContract.connection = conneciton;
                        play(message.guild, queueContract.songs[0]);
                    }
                    catch (err)
                    {
                        console.log("Error in MusicBot `Play` command try block.")
                        console.error(err)
                        queue.delete(message.guild.id);
                        message.channel.send("Seems there was an error with that command. We stripped the data, error visible in console. Please try again.");
                        //return message.channel.send("Seems there was an error with that command. We stripped the data, error visible in console. Please try again.");
                    }
                }
                else
                {
                    serverQueue.songs.push(song);
                    console.log(serverQueue.songs);
                    message.channel.send(`${song.title} has been added to the Queue.`); //need to update this later to clear queue then play.
                    //return message.channel.send(`${song.title} has been added to the Queue.`); //need to update this later to clear queue then play.
                }
                break;
            case "restart":
                dispatcher = serverQueue.connection
                    .play(ytdl(song.url)) //extention of const dispatcher
                    .on("finish", () => //extention of const dispatcher
                    {
                        serverQueue.songs.shift();
                        play(guild, serverQueue.songs[0]);
                    })
                    .on("error", error => console.error(error)); //extention of const dispatcher
                dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
                serverQueue.textChannel.send(`Restarting: **${song.title}** @ volume level ${serverQueue.volume}`)
                break;
            case "list":
                message.channel.send("**Here's the current Queue!** \n ```\n"+stringTable.create(serverQueue.song))
                //write queue
                break;
            case "leave":
                serverQueue.voiceChannel.leave();
                queue.delete(guild.id); //clean up after yourself...
                //return;
                break;
            case "music":
                message.channel.send("This is the root command, Please do no1/help music to see the full list of music commands.");
                break;
            default:
                console.log(messagestring.toLowerCase())
                message.channel.send("It appears you ran a Music command, but we didn't find a match! Please try no1/help music for more information!")
        }
        
        function skip(message, serverQueue)
        {
            if(!serverQueue)
                message.channel.send("There are no songs left in the Queue!");
                //return message.channel.send("There are no songs left in the Queue!");
            serverQueue.connection.dispatcher.end();
        }
        function stop(message,serverQueue)
        {
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
        }
        function play(guild, song)
        {
            const serverQueue = queue.get(guild.id);
            if(!song)
            {//probably remove this later.
                serverQueue.songs = [];
                serverQueue.connection.dispatcher.end();
            }
            const dispatcher = serverQueue.connection
                .play(ytdl(song.url)) //extention of const dispatcher
                .on("finish", () => //extention of const dispatcher
                {
                    serverQueue.songs.shift();
                    play(guild, serverQueue.songs[0]);
                })
                .on("error", error => console.error(error)); //extention of const dispatcher
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
            serverQueue.textChannel.send(`Start playing: **${song.title}** @ volume level ${serverQueue.volume}`)
        }
        */
	}
}

module.exports = music; //<------------ Don't forget this one!