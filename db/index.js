const db = require("./db");
const ScreenCaps = require("./models/ScreenCaps");
const Tags = require("./models/tags");

Tags.belongsToMany(ScreenCaps, { through: "media_tags" });
ScreenCaps.belongsToMany(Tags, { through: "media_tags" });

// db.sync();
module.exports = {
	db,
	Tags,
	ScreenCaps,
};
