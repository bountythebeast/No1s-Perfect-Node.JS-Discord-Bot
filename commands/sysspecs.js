const Discord = require('discord.js');
const Command = require("../base/Command.js");
const SSH = require('simple-ssh');
const serverInfo = require("../data/hardware.json");

class sysspecs extends Command 
{
	constructor (client) 
	{
		super(client, 
		{
			name: "sysspecs", //command name, should match class.
			description: "Get current system usage data", //description
			usage: "sysspecs <servername> | blank for all. \n    Options: Node1, Node2, ca1", //usage details. Should match the name and class
            aliases: ["sysinfo","ram","utilization"]
		});
	}
    /*
    ssh.exec('sudo <command>', {
        pty: true //<-- this is the key.
    }).start();
    */
	async run (message, args, level) 
	{ // eslint-disable-line no-unused-vars
        switch(args[0])
        {
            case "node1":
                {
                    checkSysSpecs(serverInfo.node1,serverInfo.sshUserAlt,serverInfo.sshPasswordAlt,serverInfo.sshPortNode1,"node1")
                    .then(returnspecs =>embed(args,returnspecs))
                }
                break;
            case "node2":
                {
                    checkSysSpecs(serverInfo.node2,serverInfo.sshUserAlt,serverInfo.sshPasswordAlt,serverInfo.sshPortNode2,"node2")
                    .then(returnspecs =>embed(args,returnspecs))
                }
                break;
            case "ca1":
                {
                    checkSysSpecs(serverInfo.ca1,serverInfo.sshUserAlt,serverInfo.sshPasswordAlt,serverInfo.sshPortca1,"ca1")
                    .then(returnspecs =>embed(args,returnspecs))
                }
                break;
            default:
                {
                    message.channel.send("Retrieving information for all nodes, this may take a minute! \n   `Please note, each server will have its own 'embed' due to how the API is restricted. This means it will return multiple messages!`")
                    let node1 = await checkSysSpecs(serverInfo.node1,serverInfo.sshUserAlt,serverInfo.sshPasswordAlt,serverInfo.sshPortNode1,"node1")
                    let node2 = await checkSysSpecs(serverInfo.node2,serverInfo.sshUserAlt,serverInfo.sshPasswordAlt,serverInfo.sshPortNode2,"node2")
                    let ca1 = await checkSysSpecs(serverInfo.ca1,serverInfo.sshUserAlt,serverInfo.sshPasswordAlt,serverInfo.sshPortca1,"ca1")

                    Promise.all([node1,node2,ca1]).then((values) => {
                        embed(args,values)
                    });

                }
                break;
        }
        async function checkSysSpecs(sshHost,sshUser,sshPass,sshPort,name)
        {
            return new Promise( (resolve) =>
            {

                let ssh = new SSH(
                    {
                        host: sshHost,
                        user: sshUser,
                        pass: sshPass,
                        port: sshPort
                    });
                let RAMCheck = `free -h | awk 'NR==2{printf "Memory Usage: %s/%s (%.2f%%)", $3,$2,$3*100/$2 }'`
                let DiskCheck = `df -h | awk '$NF=="/"{printf "Disk Usage: %s/%s (%s)", $3,$2,$5}'`
                let CPUCheck = `top -bn1 | grep load | awk '{printf "CPU Load: %.2f%", $(NF-2)}'`
                let RAM,DISK
                ssh
                    .exec(RAMCheck,
                    {
                        out: function(stdout) 
                        {
                            console.log(stdout)
                            RAM = stdout
                        },
                        err: function (stderr) { console.error(stderr); RAM = stderr},
                    })
                    .exec(DiskCheck,
                    {
                        out: function(stdout) 
                        {
                            console.log(stdout)
                            DISK = stdout
                        },
                        err: function (stderr) { console.error(stderr); DISK = stderr},
                    })
                    .exec(CPUCheck,
                    {
                        out: function(stdout) 
                        {
                            console.log(stdout)
                            let returnsystemspecs = {RAM: RAM,DISK: DISK,CPU: stdout,Name:name}
                            resolve(returnsystemspecs)
                        },
                        err: function (stderr) { console.error(stderr); CPU = stderr;let returnsystemspecs ={RAM: RAM,DISK: DISK,CPU: stdout,Name,name};resolve(returnsystemspecs) },
                    })
                    .start();
            })
        } //end function checkSysSpecs


        function embed(args,returnspecs)
        {
            console.log(returnspecs)
            if(returnspecs[0].Name)
            {
                returnspecs.forEach(system =>
                {
                    const testEmbed = {
                        title: "System Specs for "+system.Name,
                        fields: [
                            { 
                                name: 'RAM Usage [Used/Total (%)]', 
                                value: system.RAM
                            },
                            { 
                                name: 'Disk Usage [Used/Total (%)]', 
                                value: system.DISK,
                                inline: false, 
                            },
                            { 
                                name: 'CPU Load [%]', 
                                value: system.CPU,
                                inline: false,
                            },
                        ],
                        timestamp: new Date(),
                    };
                    console.log(testEmbed)
                    message.channel.send({embed: testEmbed});
                })
            }
            else
            {
                const testEmbed = {
                    title: "System Specs for "+args,
                    fields: [
                        { 
                            name: 'RAM Usage [Used/Total (%)]', 
                            value: returnspecs.RAM
                        },
                        { 
                            name: 'Disk Usage [Used/Total (%)]', 
                            value: returnspecs.DISK,
                            inline: false, 
                        },
                        { 
                            name: 'CPU Load [%]', 
                            value: returnspecs.CPU,
                            inline: false,
                        },
                    ],
                    timestamp: new Date(),
                };
                console.log(testEmbed)
                message.channel.send({embed: testEmbed});
            }
        } //end embed function
	}
}

module.exports = sysspecs; //<------------ Don't forget this one!
