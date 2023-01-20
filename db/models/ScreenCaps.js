const Sequelize = require('sequelize')
const db = require('../db')

const ScreenCaps = db.define("screenCap", {
    location:{
        type: Sequelize.STRING,
        allowNull:false,
    }
})

module.exports = ScreenCaps