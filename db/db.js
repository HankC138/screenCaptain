const Sequelize = require("sequelize");

//create database link between sequelize and PG
const db = new Sequelize("postgres://localhost:5432/screenCaptain", {
	logging: false,
});

module.exports = db;
