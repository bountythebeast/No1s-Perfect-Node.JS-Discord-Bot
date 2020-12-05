const Command = require("../base/Command.js");
const SSH = require('simple-ssh');
const serverInfo = require("../data/hardware.json");

class upnpcfix extends Command 
{
	constructor (client) 
	{
		super(client, 
		{
			name: "upnpcfix", //command name, should match class.
			description: "A command to fix port issues with UPNPC on the backend. It automatically checks if it needs to run.", //description
            usage: "upnpcfix ", //usage details. Should match the name and class
            category: "Bot Admin Commands",
            permLevel: "Bot Admin",
			aliases: ["upnpc","upnpcfix","upnpcupdate","portfix","fixports"]
		});
	}

	async run (message, args, level) 
	{ 
        var ssh = new SSH(
        {
            host: serverInfo.node2,
            user: serverInfo.sshUser,
            pass: serverInfo.sshPassword,
            port: serverInfo.sshPortNode2        
        });
        //run upnpc -l and see if it has data.
        const msg = await message.channel.send("Checking status of UPNPC!")
        let sshcommand = "cd /etc/UPNPC;upnpc -l"
        let outputtemp
        ssh.exec(sshcommand,
        {
            out: function(stdout) 
            {
                if(stdout.includes(serverInfo.UPNPCCheck))
                {
                    msg.edit("Checking status of UPNPC! \nUPNPC ports are correct!")
                    outputtemp += stdout
                }
            },
            err: function (stderr) { console.error(stderr); Message.channel.send("There were errors running the command, Check console.")},
            exit: function (code) 
            {
                if(!outputtemp.includes(serverInfo.UPNPCCheck))
                {                  
                    msg.edit("Checking status of UPNPC! \nUPNPC Ports are not set properly! I'll fix that for you.\nUpdating UPNPC **[=====]**")
                    let sshcommand = "cd /etc/UPNPC;sh UPNPC-Bot.sh"
                    let temp = 0
                    let tempmessage
                    ssh.exec(sshcommand,
                    {
                        out: function (stdout) 
                        {
                            temp++
                            if(temp === 1)
                            {tempmessage = "**[@====]**"}
                            else if(temp === 2)
                            {tempmessage = "**[=@===]**"}
                            else if(temp === 3)
                            {tempmessage = "**[==@==]**";}
                            else if(temp === 4)
                            {tempmessage = "**[===@=]**";}
                            else if(temp === 5)
                            {tempmessage = "**[====@]**";}
                            else if(temp === 6)
                            {tempmessage = "**[===@=]**";}
                            else if(temp === 7)
                            {tempmessage = "**[==@==]**";}
                            else if(temp === 8)
                            {tempmessage = "**[=@===]**";}
                            else if(temp === 9)
                            {tempmessage = "**[@====]**"; temp = 0;}
                            msg.edit("Checking status of UPNPC! \nUPNPC Ports are not set properly! I'll fix that for you.\nUpdating UPNPC "+tempmessage)
                        },
                        err: function (stderr) { console.error(stderr); Message.channel.send("There were errors running the command, Check console.")},
                        exit: function (code) { msg.edit("Checking status of UPNPC! \nUPNPC Ports are not set properly! I'll fix that for you.\nUpdating UPNPC "+tempmessage+"\n UPNPC-Update has completed.");}
                    }).start();
                }
            }
        }).start();
	}
}

module.exports = upnpcfix; //<------------ Don't forget this one!
