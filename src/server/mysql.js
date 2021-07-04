require('dotenv').config();
var mysql = require('mysql');

var databaseName = process.env.DB_NAME;
var pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: databaseName
})

module.exports = pool;
