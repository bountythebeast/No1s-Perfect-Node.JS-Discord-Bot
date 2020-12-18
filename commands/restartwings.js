const Command = require("../base/Command.js");
const SSH = require('simple-ssh');
const serverInfo = require("../data/hardware.json");

class restartwings extends Command 
{
	constructor (client) 
	{
		super(client, 
		{
			name: "restartwings", //command name, should match class.
			description: "Restart the wings daemon.", //description
            usage: "restartwings <node1,node2,laptop> | One of them is required, only accepts 1 argument.", //usage details. Should match the name and class
            category: "Bot Admin Commands",
            permLevel: "Bot Admin",
			aliases: ["wings","wing","restartwing"]
		});
	}

	async run (message, args, level) 
	{ 
        if(!args[0])
        {
            message.channel.send("Error, you need to provide a system to restart wings on.")
            return;
        }
        if(args[0].toLowerCase() === "node2")
        {
            var ssh = new SSH(
            {
                host: serverInfo.node2,
                user: serverInfo.sshUser,
                pass: serverInfo.sshPassword,
                port: serverInfo.sshPortNode2        
            });
        }
        else if(args[0].toLowerCase() === "node1")
        {
            var ssh = new SSH(
            {
                host: serverInfo.node1,
                user: serverInfo.sshUser,
                pass: serverInfo.sshPassword,
                port: serverInfo.sshPortNode1        
            });
        }
        else if(args[0].toLowerCase() === "laptop")
        {
            var ssh = new SSH(
            {
                host: serverInfo.laptop,
                user: serverInfo.sshUser,
                pass: serverInfo.sshLaptopPassword,
                port: serverInfo.sshPortLaptop        
            });
        }
        const msg = await message.channel.send("Restarting wings!")
        let sshcommand = "systemctl restart wings"
        try
        {
            ssh.exec(sshcommand,
            {
                err: function (stderr) 
                { 
                    if(stderr.toString().includes("Job for wings.service failed."))
                    {                  
                        msg.edit("Systemctl issue, running reset-failed.")
                        
                        ssh.exec("systemctl reset-failed",
                        {
                            err: function (stderr) 
                            { 
                                console.error(stderr); Message.channel.send("There were errors running the command, Check console.")
                            },
                            exit: function (code) 
                            { 
                                ssh.exec("systemctl restart wings",
                                {
                                    err: function(stderr) 
                                    {
                                        console.log(stderr); 
                                        message.channel.send("There was an error restarting wings after pushing Systemctl reset-failed.")
                                    },
                                    exit: function (code) 
                                    {
                                        msg.edit("Wings has been restarted.");
                                    }

                                }).start();
                            }
                        }).start();
                    }
                    else
                    {
                        msg.edit("Error! Wings uncaught exception. Please restart manually.")
                    }
                },
                exit: function (code) 
                {
                    msg.edit("Wings has been restarted successfully.")
                }
            }).start();
        }
        catch
        {
            msg.edit("There was an error, Script has exited from the command to prevent causing issues.")
        }
	}
}

module.exports = restartwings; //<------------ Don't forget this one!
