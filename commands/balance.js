const Command = require("../base/Command.js");
var mysql = require('mysql');
var stringTable = require('string-table');

class balance extends Command 
{
	constructor (client) 
	{
		super(client, 
		{
			name: "balance", //command name, should match class.
			description: "Reports the balance of the user that was provided as a parameter, or returns the top 50 users! (retrieves this directly from Database)", //description
			usage: "balance or balance <name> or balance <num> (Number to be top x to display)", //usage details. Should match the name and class
			aliases: ["bal","money","baltop"]
		});
	}

	async run (message, args, level) 
	{
        try {
			const DBString = require("../data/sqldata.json");
			var pool = mysql.createPool
			({
				connectionLimit : 10,
				host: DBString.DBIP,
				database: DBString.SurvivalBalanceDBName,
				user: DBString.DBUser,
				password: DBString.DBPass,
				port: DBString.DBPort
			});
        }
        catch(err)
        {
            message.channel.send("Seems there was an error setting up the Database connection. Please report this to our GitHub!")
        }
        let customlength
        if(!isNaN(args))
        {
            if(!args === undefined)
            {
                pool.getConnection(function (err,connection)
                {
                    var ret = [];
                    var sql = `SELECT player_name,money FROM mpdb_economy WHERE (money > 1) ORDER BY money DESC LIMIT `+args;
                    connection.query(sql, function (err, rows, fields)
                    {
                        if(err)
                        {
                            console.error(err)
                        }
                        if(pool._freeConnections.indexOf(connection) < 0)
                        {
                            connection.release();
                        }
                        console.log(rows)
                        for (var i of rows)
                        {
                            ret.push(i);
                        }
                        message.channel.send("**Displaying the top "+args+" Players:** ```\n\n"+stringTable.create(ret)+"```"); //until the command 
                    });
                });	
            }
        } 
        else if(args[0])
        {
            let Username = args
            pool.getConnection(function (err,connection)
			{
                var ret = [];
				var sql = `SELECT player_name,money FROM mpdb_economy WHERE player_name LIKE '${Username}' ORDER BY money DESC`;
                connection.query(sql, function (err, rows, fields)
                {
                    if(err)
                    {
                        console.error(err)
                    }
                    if(pool._freeConnections.indexOf(connection) < 0)
                    {
                        connection.release();
                    }
                    console.log(rows)
					for (var i of rows)
                    {
                        ret.push(i);
                    }
					message.channel.send("```\n"+stringTable.create(ret)+"```"); //until the command 
				});
			});	
        }
        else
        {
            pool.getConnection(function (err,connection)
			{
                var ret = [];
				var sql = `SELECT player_name,money FROM mpdb_economy WHERE (money > 1) ORDER BY money DESC LIMIT 50`;
                connection.query(sql, function (err, rows, fields)
                {
                    if(err)
                    {
                        console.error(err)
                    }
                    if(pool._freeConnections.indexOf(connection) < 0)
                    {
                        connection.release();
                    }
                    console.log(rows)
					for (var i of rows)
                    {
                        ret.push(i);
                    }
					message.channel.send("**Displaying the top 50 Players:** ```\n\n"+stringTable.create(ret)+"```"); //until the command 
				});
			});	
        }	
	}
}

module.exports = balance; //<------------ Don't forget this one!
