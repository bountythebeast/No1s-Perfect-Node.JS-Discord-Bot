const Command = require("../base/Command.js");
var mysql = require('mysql');

class getsql extends Command {
	constructor (client) {
		super(client, {
			name: "getsql",
			description: "Backend command to retrieve database values for notifications.",
			category: "System",
			usage: "getsql"
		});
	}

	async run (message, args, level) { // eslint-disable-line no-unused-vars
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
						ret.push(`UniqueID:${i.ID}, UserName:${i.UserName.replace("`","'")}, DiscordID:${i.DiscordID}, NotificationPreference:${i.Notification_Preference}`);

					message.channel.send(ret); //until the command 
				});
			});	
		} catch (e) {
			console.log(e);
		}
	}
}

module.exports = getsql;