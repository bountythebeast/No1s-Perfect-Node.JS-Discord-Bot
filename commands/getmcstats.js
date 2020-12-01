var ms = require('../data/minestat');
const Command = require("../base/Command.js");
var serverstuff = require("../data/servers.json");
const Query = require("minecraft-query");
const getsql = require('./getsql');
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
        });
    }
    async run (message, args, level) { // eslint-disable-line no-unused-vars
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
            await ms.init(IP,Port,function()
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
                
                            pool.getConnection(function (err,connection)
                            {
                                var ret = [];
                                var sql = "Select ID,UserName,DiscordID,Notification_Preference,IsAdmin FROM Discord_Users"
                                connection.query(sql, function (err, rows, fields){
                                    connection.release();
                                    console.log(rows);
                                    for (var i of rows)
                                    {
                                        if(i.Notification_Preference)
                                        {
                                            datastring += "<@"+i.DiscordID+">"
                                        }
                                    }
                                });
                            });	
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    message.channel.send(datastring+"```");
                    datastring = '';networkdata = '';
                }
            });
        })
    }
}
module.exports = getmcstats;