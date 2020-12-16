const Command = require("../base/Command.js");
var serverstuff = require("../data/servers.json");
const getsql = require('./getsql');
const util = require('minecraft-server-util');
var mysql = require('mysql');

//Were taking advantage of https://developer.aliyun.com/mirror/npm/package/minecraft-server-util
//and their minecraft-server-util extension! Huge Shoutout!

var criticaloffline = false;
const CriticalOfflineServers = [];

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
        var keys = Object.keys(serverstuff);
        const promises = [];
        keys.forEach(async(server,index) =>
        {
            promises.push(CheckOnline(server,index))
        });
        Promise.all(promises).then(results =>
        {
            if(criticaloffline)
            {
                console.log(results) //this is just for testing/debugging.
                message.channel.send("```css\n"+results +"```")
                getNotify().then(notifystaff =>
                {
                    console.log(notifystaff)
                    message.channel.send("It appears the following servers are offline! \n **["+ CriticalOfflineServers +"]** \n "+ notifystaff +"\n(Note to self, add the ability for admin react on this message to start critical servers)")
                });
            }
            else
            {
                message.channel.send("```css"+results+"```")
            }
        })
        function getNotify()
        {
            return new Promise( (resolve) =>
            {
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
                        var sql = 'Select DiscordID FROM Discord_Users WHERE Notification_Preference = "true"'
                        
                        connection.query(sql, (err, rows, fields) =>
                        {
                            connection.release();
                            if(rows.length >1)
                            {
                                const prom = [];
                                console.log(rows)
                                var rowkeys = Object.keys(rows);
                                rowkeys.forEach((useless,index) =>
                                {
                                    console.log(rows[index].DiscordID)
                                    prom.push(cleanRows(rows[index].DiscordID))
                                })

                                
                                Promise.all(prom).then(results =>
                                {
                                    resolve(results)
                                });
                            }
                            else
                            {
                                resolve("<@"+rows[0].DiscordID+">")
                            }
                            function cleanRows(row)
                            {
                                return new Promise( (resolve) =>
                                {
                                    resolve(`<@${row}>`)
                                })
                            }
                        });
                    });	
                } 
                catch (error) 
                {
                    resolve("Error connecting to database, could not notify staff.")
                }
            })
        }
        function CheckOnline(server,index)
        {
            return new Promise( (resolve) =>
            {
                let IP = (serverstuff[keys[index]].IP);
                let QueryPort = (serverstuff[keys[index]].Query);
                let Critical = (serverstuff[keys[index]].Critical);
                //server name is 'server'
                util.queryFull(IP, {port: QueryPort, timeout: 2000})
                .then((response) =>
                {
                    if(response.onlinePlayers < 1)
                    {
                        resolve(`\n[${server}] - Online \n    Supported Versions: ${response.version}\n    Hosting: ${response.onlinePlayers}/${response.maxPlayers} Players`)
                    }
                    else
                    {
                        resolve(`\n[${server}] - Online \n    Supported Versions: ${response.version}\n    Hosting: ${response.onlinePlayers}/${response.maxPlayers} Players\n    PlayerList: ${response.players}`)
                    }
                })
                .catch((error) =>
                {
                    console.log(error)
                    if(Critical)
                    {
                        CriticalOfflineServers.push(server)
                        criticaloffline = true;
                    }
                    resolve(`\n[${server}] - Offline!`)
                });
            });
        }
    }
}
module.exports = getmcstats;