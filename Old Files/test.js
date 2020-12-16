var ms = require('../data/minestat');
const Command = require("../base/Command.js");
var serverstuff = require("../data/servers.json");
const Query = require("minecraft-query");
const getsql = require('./getsql');
const {promisify} = require ('util');
var mysql = require('mysql');
var prestring ='```css\n  ~~~Current status of our servers: ~~~ \n';
var networkdata = '';
var datastring = '';
var criticaloffline = false;
/* Notes
- Still need to implement the player(s) list... uses 'minecarft-query - npm'
*/

//This was a testing file for replacing getMCStats.js

class test extends Command
{
    constructor (client)    
    {
        super(client, {
            name: "test",
            description: "Get MC Server status",
            usage: "test"
        });
    }
    async run (message, args, level) { // can definity clean this up....
        var PortDifference = 100;
        var keys = Object.keys(serverstuff);
        const promises = [];
        
        keys.forEach((server,index) =>
        {
            promises.push(checkOnline(server,serverstuff,keys,index,criticaloffline));
        })

        Promise.all(promises).then(results => 
        {
            //this is an array of all the results from the foreach loop.
            console.log(results); //this is a test...
            console.log(results.join());
            //write data to a single value.
            if(criticaloffline)
            {
                getNotify().then(ret =>
                {
                    //value += ret
                }).then(finalret =>
                {
                    finalResponse()
                })
            }
        }).catch(errors =>
        {
            console.log("errors in Promise.all: \n"+errors)
        });

        async function checkOnline(server,serverstuff,keys,index,criticaloffline)
        {
            try
            {
                let IP = await (serverstuff[keys[index]].IP);
                let Port = await (serverstuff[keys[index]].Port);
                let Critical = await (serverstuff[keys[index]].Critical);
                await ms.init(IP,Port,function() //still need to fix this... its awaiting improperly.
                {
                    if(ms.online)
                    {
                        if(server === 'Network')
                        {
                            return "Status of: ["+server + "]:\n   Server is online running version "+ms.version + " with "+ ms.current_players + " out of " + ms.max_players + " players.\n";
                        }
                        else
                        {
                            return "Status of: ["+server + "]:\n   Server is online running version "+ms.version + " with "+ ms.current_players + " out of " + ms.max_players + " players.\n";
                        }
                    }
                    else
                    {
                        if(Critical)
                        {
                            criticaloffline = true
                        }
                        return "Status of: ["+server +"]:\n   Server is offline!\n";
                    }
                });
            }
            catch(error)
            {
                return "Error, hit catch block: "+error
            }
        }
        function getNotify()
        {
            let tempval
            try 
            {
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
                pool.getConnection(function (err,connection)
                {
                    var ret = [];
                    var sql = "Select ID,UserName,DiscordID,Notification_Preference,IsAdmin FROM Discord_Users"
                    connection.query(sql, (err, rows, fields) =>
                    {
                        connection.release();
                        for (var i of rows)
                        {
                            if(i.Notification_Preference.toLowerCase === 'true')
                            {
                                tempval += "<@"+i.DiscordID+">"
                            }
                        }
                        return tempval
                    });
                });	
            } 
            catch (error) 
            {
                return "Error connecting to database"
            }
        }
        function finalResponse()
        {
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
    
    }
}
module.exports = test;