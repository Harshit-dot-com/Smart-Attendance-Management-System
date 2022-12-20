const mysql = require('mysql');

var connection = mysql.createConnection({
	host : 'localhost',
	port:3306,
	database : 'samdb',
	user : 'root',
	password : 'harshit232'
});

connection.connect(function(error){
	if(error){
		throw error;
	}
	else
	{
		console.log('MySQL Database is connected Successfully');
	}
});

module.exports = connection;
