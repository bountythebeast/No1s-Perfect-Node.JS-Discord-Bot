const Command = require("../base/Command.js");
const ytdl = require('ytdl-core');
var stringTable = require('string-table');
const queue = new Map();
//I *should* split this into individual commands, and have it super the music.js class. 

class music extends Command 
{
	constructor (client) 
	{
		super(client, 
		{
			name: "music", //command name, should match class.
			description: "The catch all for music commands. Everything else is an alis of this.", //description
			usage: "Play <song> (immediate, skips current), skip (skip current), pause (pauses music), stop (bot leaves channel, clears queue), clear (clears queue), restart (restarts current song), Leave (bot leaves vc), List (current Queue)", 
			aliases: ["play","skip","pause","resume","stop","clear","queue","restart","leave","list","volume","playnow-NotYetImplemented"]
		});
	}

	async run (message, args, level) 
	{
        let voiceChannel = message.member.voice.channel; //this may need to change. It does not update fast enough when a user moves channels.
        MusicSetup(message).then(temp => switchCase(message,temp)).catch(error => {console.log("Errors in music command. \n"+error)})
        //create queue
        async function MusicSetup(message)
        {
            try
            {
                let messagestring = await cleanMusicMessage(message.content.toString());
                function cleanMusicMessage(message)
                {
                    if(!message.includes(" "))
                    {
                        message = message.substring(message.indexOf("/")+1)
                    }
                    else
                    {
                        message = message.substring(message.indexOf("/")+1,message.indexOf(" ")) //this is the sub command.
                    }
                    console.log("Command name: "+message)
                    return message;
                }
                return messagestring;
            }
            catch(e)
            {
                console.log("error in trycatch: \n"+e)
            }
        }
        async function switchCase(message,messagestring)
        {
            const serverQueue = await queue.get(message.guild.id)
            const permissions = voiceChannel.permissionsFor(message.client.user);
            switch(messagestring) //may have to remove 'return's, switch statements don't play nice with them.
            {
                case "play":
                    if(!voiceChannel)
                    {
                        //message.channel.send("You need to be in a voice channel to play music, sorry!");
                        return message.channel.send("You need to be in a voice channel to play music, sorry!");
                    }

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
                    if((!serverQueue) || serverQueue.songs.length <= 1)//may need to change, as we have a command to queue seperately.
                    {
                        const queueContract = 
                        {
                            textChannel: message.channel,
                            voiceChannel: voiceChannel,
                            connection: null,
                            songs: [],
                            volume: 1,
                            playing: true,
                        };
                        queue.set(message.guild.id, queueContract);
                        queueContract.songs.push(song);
                        try
                        {
                            console.log("Trying to Join VC");
                            const connection = await message.member.voice.channel.join();
                            console.log("Joined VC");
                            queueContract.connection = connection;
                            play(message.guild, queueContract.songs[0]);
                        }
                        catch (err)
                        {
                            console.log("Error in MusicBot `Play` command try block.")
                            console.error(err)
                            queue.delete(message.guild.id);
                            message.member.voice.channel.leave();
                            //message.channel.send("Seems there was an error with that command. We stripped the data, error visible in console. Please try again.");
                            return message.channel.send("Seems there was an error with that command. We stripped the data, error visible in console. Please try again.");
                        }
                    }
                    else
                    {
                        serverQueue.songs = [];
                        serverQueue.songs.push(song);
                        skip(message,serverQueue)
                        //message.channel.send(`${song.title} is playing now.`); //need to update this later to clear queue then play.
                        return message.channel.send(`${song.title} is playing now.`); //need to update this later to clear queue then play.
                    }
                    break; //required.
                case "skip":
                    skip(message,serverQueue);
                    let currentsong = serverQueue.songs[0].title;
                    return message.channel.send(`Skipped current song ${currentsong}`);
                    break;
                case "resume":
                    serverQueue.connection.dispatcher.resume();
                    break;
                case "pause":
                    serverQueue.connection.dispatcher.pause();
                    break;
                case "stop":
                    stop(message, serverQueue);
                    break;
                case "clear":
                    try
                    {
                        serverQueue.songs = [];
                        message.channel.send("Queue has been cleared.");
                    }
                    catch 
                    {
                        message.channel.send("Queue has been cleared.");
                    }
                    break;
                case "queue":
                    if(!voiceChannel)
                    {
                        //message.channel.send("You need to be in a voice channel to play music, sorry!");
                        return message.channel.send("You need to be in a voice channel to play music, sorry!");
                    }
                    if(!permissions.has("CONNECT") || !permissions.has("SPEAK"))
                    {
                        //message.channel.send("I do not have the permissions required to Join or Speak in "+voiceChannel.name+". Please try a different channel, or update my permissions!");
                        return message.channel.send("I do not have the permissions required to Join or Speak in "+voiceChannel.name+". Please try a different channel, or update my permissions!");
                    }

                    // may wrap the above with something like if(queueContract.connection) so that i can skip the checks if the bot is already in a vc
                    if(serverQueue)
                    {
                        async function getSongInfo(songURL)
                        {
                            return await ytdl.getInfo(songURL);
                        }

                        songInfo = await getSongInfo(args[0])
                        song = 
                        {
                            title: songInfo.videoDetails.title,
                            url: songInfo.videoDetails.video_url,
                        };
                        if(!serverQueue)
                        {
                            const queueContract = 
                            {
                                textChannel: message.channel,
                                voiceChannel: voiceChannel,
                                connection: null,
                                songs: [],
                                volume: 1,
                                playing: true,
                            };
                            queue.set(message.guild.id, queueContract);
                            queueContract.songs.push(song);
                            try
                            {
                                var connection = await voiceChannel.join();
                                queueContract.connection = connection;
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
                    }
                    else
                    {
                        message.channel.send("Error, it appears there the bot isn't playing music in this server! Please try using play instead.")
                    }
                    break;
                case "restart":
                    if(typeof serverQueue !== 'undefined' && serverQueue)
                    {
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
                    }
                    else
                    {
                        message.channel.send("It appears there is no song playing to restart!")
                    }
                    break;
                case "list":
                    if(typeof serverQueue !== 'undefined' && serverQueue.songs)
                    {
                        if(serverQueue.songs.title != undefined)
                        {
                            message.channel.send("**Here's the current Queue!** \n"+serverQueue.songs.title)
                        }
                        else
                        {
                            message.channel.send("The queue is currently Empty!")
                        }
                    }
                    else
                    {
                        message.channel.send("It appears there is no Queue! Try no1/play <url>")
                    }
                    function expandit(min, max)
                    {
                        return Math.floor
                        (
                            Math.random() * (max - min) + min
                        )
                    }
                    if((expandit(1,5)) == 3)
                    {
                        console.log(3)
                        message.channel.send("The list is incomplete, You can help by EXPANDING IT! \n\n https://i.redd.it/q6u6ctn3q0g31.png")
                    }
                    break;
                case "leave":
                    serverQueue.voiceChannel.leave();
                    queue.delete(guild.id); //clean up after yourself...
                    //return;
                    break;
                case "music":
                    message.channel.send("This is the root command, Please do no1/help music to see the full list of music commands.");
                    break;
                case "volume":
                    if(typeof serverQueue !== 'undefined' && serverQueue.volume)
                    {
                        if(isNaN(args))
                        {
                            message.channel.send("It appears you supplied Volume without a number. Please set a Number for the new Volume between 0-10. \n Currently Volume is set to: "+serverQueue.volume)
                        }
                        else
                        {
                            args = (Number(args))
                            if(args < 0 || args > 10)
                            {
                                message.channel.send("Volume must be between 0 and 10. (You *CAN* use decimals. So 1.2, 1.5 work just fine too.")
                            }
                            else
                            {
                                if(serverQueue.volume === args)
                                {
                                    message.channel.send("It appears the volume is already set to "+args+"!")
                                }
                                else
                                {
                                    serverQueue.volume = args
                                    serverQueue.connection.dispatcher.setVolumeLogarithmic(serverQueue.volume/5)
                                    message.channel.send("Volume has been set to: "+serverQueue.volume)
                                }
                            }
                        }
                    }
                    else
                    {
                        message.channel.send("You cannot change the volume of the bot unless its in an audio channel.")
                    }
                    //update volume here. 1-10.
                    break;
                default:
                    console.log(messagestring.toLowerCase())
                    message.channel.send("It appears you ran a Music command, but we didn't find a match! Please try no1/help music for more information!")
            }
        }
        
        function skip(message, serverQueue)
        {
            if((!serverQueue) || (serverQueue.songs.length <= 1))
                //message.channel.send("There are no songs left in the Queue!");
                return message.channel.send("There are no songs left in the Queue!");
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
                message.channel.send("The song Queue is empty. Bot will leave shortly if no new song is queue'd");
                //serverQueue.voiceChannel.leave(); <-- if queue is empty, bot leaves.
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
	}
}

module.exports = music; //<------------ Don't forget this one!


        /*
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
            console.log("Checking vc "+voiceChannel)
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
                volume: 3,
                playing: true
              };
          
              queue.set(message.guild.id, queueContruct);
          
              queueContruct.songs.push(song);
          
              voiceChannel.join().then(connection => 
                {
                    connection.play(message.guild, queueContruct.songs[0])
                }).catch(() => 
                {            
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
          */