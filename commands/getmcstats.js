var ms = require('../data/minestat');
const Command = require("../base/Command.js");
var serverstuff = require("../data/servers.json");
const Query = require("minecraft-query");
const getsql = require('./getsql');
var mysql = require('mysql');
var prestring ='```css\n  ~~~Current status of our servers: ~~~ \n';
var networkdata = '';
var datastring = '';
var criticaloffline = false;
/* Notes
- Still need to implement the player(s) list... uses 'minecarft-query - npm'
*/

class getmcstats extends Command
{
    constructor (client)    
    {
        super(client, {
            name: "getmcstats",
            description: "Get MC Server status",
            usage: "getmcstats",
            aliases: ["mcstats","serverstats","minecraft","isitup","servers","mcstatus"]
        });
    }
    async run (message, args, level) { // can definity clean this up....
        var PortDifference = 100;
        var keys = Object.keys(serverstuff);
        //for(var i=0;i<keys.length;i++)
        //keys.forEach(async(server,index) => 
        //for(var index, server in serverstuff)
        var endscript = false
        keys.forEach(async(server,index) =>
        {
            let IP = (serverstuff[keys[index]].IP);
            let Port = (serverstuff[keys[index]].Port);
            let Critical = (serverstuff[keys[index]].Critical);
            ms.init(IP,Port,function()
            {
                if(ms.online)
                {
                    if(server === 'Network')
                    {
                        networkdata = "Status of: ["+server + "]:\n   Server is online running version "+ms.version + " with "+ ms.current_players + " out of " + ms.max_players + " players.\n";
                    }
                    else
                    {
                        datastring += "Status of: ["+server + "]:\n   Server is online running version "+ms.version + " with "+ ms.current_players + " out of " + ms.max_players + " players.\n";
                    }
                }
                else
                {
                    datastring += "Status of: ["+server +"]:\n   Server is offline!\n";
                    if(Critical)
                    {
                        criticaloffline = true
                    }
                }
                var keylength = keys.length
                if(datastring.includes(keys[keylength-1]))
                {
                    
                    datastring = prestring + networkdata + datastring
                    if(criticaloffline)
                    {
                        datastring += "\n\n One or more servers marked as critical are offline! Notifying staff... \n";
                        try {
                            const {DBUser,DBPass,DBName,DBIP,DBPort} = require("../data/sqldata.json");
                            var pool = mysql.createPool
                            ({
                                connectionLimit : 10,
                                host: DBIP,
                                database: DBName,
                                user: DBUser,
                                password: DBPass,
                                port: DBPort
                            });
                
                            pool.getConnection(function (err,connection) //this happens AFTER it sets the text of the datastring return. need to fix.
                            {
                                var ret = [];
                                var sql = "Select ID,UserName,DiscordID,Notification_Preference,IsAdmin FROM Discord_Users"
                                connection.query(sql, function (err, rows, fields){
                                    connection.release();
                                    for (var i of rows)
                                    {
                                        if(i.Notification_Preference.toLowerCase === 'true')
                                        {
                                            datastring += "<@"+i.DiscordID+">"
                                        }
                                    }
                                });
                            });	
                        } catch (e) {
                            console.log(e);
                        }
                        //this won't work here... it loops over it.
                        const botresponse = message.channel.send(datastring+"```") //needs await
                        botresponse.react('✔').then(r => {message.react('❌')}); //this needs to be updated to the BOT's response, probably do a .then((msg) => {})
                        botresponse.awaitReactions((reaction, user) => user.level == 9 && (reaction.emoji.name == '✔' || reaction.emoji.name == '❌'),
                            {
                                    max: 1, time: 60000 
                            }).then(collected =>
                            {
                                if(collected.first().emoji.name == '✔')
                                {
                                    message.reply("Sending start command to Critical Servers [Debug, does not work yet.]");
                                }
                            }).catch(() => {
                                message.channel.send("No reaction after 60 seconds, Critical servers were not sent start command.")
                            });
                    }
                    else
                    {
                        message.channel.send(datastring+"```");
                    }
                    datastring = '';networkdata = '';
                }
            });
        })
    }
}
module.exports = getmcstats;