const Sequelize = require('sequelize')
const db = require('../db')

const MediaTags = db.define("mediatag", {
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    tagId:{
       type:Sequelize.INTEGER,
       allowNull:false 
    },
    mediaId:{
        type:Sequelize.INTEGER,
        allowNull:false 
     }
})

module.exports = MediaTags
