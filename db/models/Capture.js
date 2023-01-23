const Sequelize = require('sequelize')
const db = require('../db');

//capture model
const Capture = db.define("capture", {
    location:{
        type: Sequelize.STRING,
        allowNull:false,
    }
})

module.exports = Capture