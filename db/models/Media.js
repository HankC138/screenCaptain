const Sequelize = require('sequelize')
const db = require('../db')

const Media = db.define("media", {
    location:{
        type: Sequelize.STRING,
        allowNull:false,
    }
})

module.exports = Media