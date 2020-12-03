const Command = require("../base/Command.js");
var mysql = require('mysql');

class notify extends Command 
{
    constructor (client) 
    {
        super(client, 
        {
            name: "notify", //command name, should match class.
            description: "Notification command. No Argument will display current notification preference if it exists", //description
            usage: "notify <optional True/False>", //usage details. Should match the name and class
            aliases: ["notifyme"]
        });
    }

    async run (message, args, level) 
    { // eslint-disable-line no-unused-vars
        var ret = [];
        let error = false;
        let temp
        var bool
        if(args[0] == 'true')
        {
            bool = true;
        }
        else if(args[0] == 'false')
        {
            bool = false;
        }
        else if(args[0] == null)
        {
            bool = null;
        }

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
            if(bool === null) //not awaited, so temp is null and jumps out of statement before populated. 
            {
                pool.getConnection(function (err,connection)
                {
                    var sql = `Select * FROM Discord_Users WHERE DiscordID = ${message.author.id}`
                    connection.query(sql, function (err, row, fields)
                    {
                        if(pool._freeConnections.indexOf(connection) < 0)
                        {
                            connection.release();
                        }
                        if(row.length > 0)
                        {
                            message.channel.send("Your current notification preference for Critical Server Offline alerts is set to: **["+row[0].Notification_Preference+"]**")
                        }
                        else
                        {
                            message.channel.send("It seems you don't have an entry in our database! You can add yourself by doing Notify <True|False>");
                        }
                    });
                });
            }
            else if((bool === true) || (bool === false))
            {
                pool.getConnection(function (err,connection) //not awaited...
                {
                    var sql = `Select * FROM Discord_Users WHERE DiscordID = ${message.author.id}`
                    connection.query(sql, function (err, row, fields)
                    {
                        if(pool._freeConnections.indexOf(connection) < 0)
                        {
                            connection.release();
                        }
                        if(row.length !== 0)
                        {
                            if(row[0].Notification_Preference !== bool)
                            {
                                sql = "update Discord_Users set Notification_Preference='"+bool+"'where DiscordID='"+message.author.id+"';";
                                connection.query(sql, function (err)
                                {
                                    if(pool._freeConnections.indexOf(connection) < 0)
                                    {
                                        connection.release();
                                    }
                                    if(err)
                                    {
                                        console.error("There was an error in the SQL Update Notification Preference block.")
                                        console.error(err)
                                        message.channel.send("There was an error updating your notification preference, Data has been stripped. Please check console.")
                                    }
                                });
                                sql = `Select * FROM Discord_Users WHERE DiscordID = ${message.author.id}`
                                connection.query(sql, function (err, row, fields)
                                {
                                    if(pool._freeConnections.indexOf(connection) < 0)
                                    {
                                        connection.release();
                                    }
                                    message.channel.send("Your notification status is now set to: "+row[0].Notification_Preference)
                                });
                            }
                        }
                        else
                        {
                            //create a new user in the database.
                            if (message.author.username.includes("'")) 
                            { 
                                let username = message.author.username.toString()
                                console.log(typeof username)
                                username = username.replace(/\'/g,"\`");
                                sql = `insert into Discord_Users (UserName, DiscordID, Notification_Preference, IsAdmin) VALUES('`+username+`','`+message.author.id+`','`+bool+`','False');`;
                            }
                            else
                            {
                                sql = `insert into Discord_Users (UserName, DiscordID, Notification_Preference, IsAdmin) VALUES('`+message.author.username+`','`+message.author.id+`','`+bool+`','False');`;
                            }
                            connection.query(sql, function (err)
                            {
                                if(pool._freeConnections.indexOf(connection) < 0)
                                {
                                    connection.release();
                                }
                                if(err)
                                {
                                    console.error("Error adding user to DB for notifications. Error:")
                                    console.error(err)
                                    message.channel.send("There was an error adding you to the Database. Data has been stripped. Check Console.")
                                }
                                else
                                {
                                    message.channel.send("You have been added to the Notification database. Notification Preference: "+bool)
                                }
                                });
                                //user does not exist, add them.
                        }
                    });
                });
            }
            else
            {
                message.channel.send("Error, you can only run this command with no arguments, or with a TRUE/FALSE argument. \n You passed the following invalid argument: \""+bool+"\"")
            }
        }
        catch (e) 
        {
            message.channel.send("It seems there was an error, but the data has been stripped. Please check console.");
            console.log("Error: \n"+e);
            return error;
        }
    }
}

module.exports = notify; //<------------ Don't forget this one!
