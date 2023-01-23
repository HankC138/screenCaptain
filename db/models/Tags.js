const Sequelize = require('sequelize')
const db = require('../db');

//tag model
const Tags = db.define("tag", {
    tagName:{
        type: Sequelize.STRING,
        allowNull:false,
    }
})

module.exports = Tags

