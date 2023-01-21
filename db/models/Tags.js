const Sequelize = require('sequelize')
const db = require('../db');

const Tags = db.define("tag", {
    tagName:{
        type: Sequelize.STRING,
        allowNull:false,
    }
})

module.exports = Tags

