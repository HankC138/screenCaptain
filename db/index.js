const db = require("./db");
const Capture = require("./models/Capture");
const Tags = require("./models/tags");

//associations between models
Tags.belongsToMany(Capture, { through: "capturetags" });
Capture.belongsToMany(Tags, { through: "capturetags" });

//this creates a new capture entry with it's location
const saveMediaLocation = (location) => {
	const captureEntry = Capture.findOrCreate({
		where: { location: location },
	});
	return captureEntry;
};

//finds a cap and attachs tags to it by finding existing or creating new tags
const saveTags = async ({ mediaId, tags }) => {
	try {
		const foundMedia = await Capture.findByPk(mediaId);
		tags.map(async (tag) => {
			try {
				const tagEntry = await Tags.findOne({
					where: { tagName: tag },
				});
				if (tagEntry) return await foundMedia.setTags(tagEntry);
				const newTag = await Tags.create({ tagName: tag });
				await foundMedia.setTags(newTag);
				return console.log(`${tag} WERE CREATED`);
			} catch (error) {
				console.error(error);
			}
		});
		console.log(`${tags} have been saved or found!`);
	} catch (error) {
		console.error(error);
	}
};

//query database for tags and their associated caps
const searchMediaTags = async (searchTerm) => {
	try {
		const foundTag = await Tags.findAll({
			where: { tagName: searchTerm },
			include: {
				model: Capture,
			},
		});
		if(foundTag.length) return JSON.stringify(foundTag[0].dataValues.captures);
		return `[{"NOTHING":"NOTHING"}]`
	} catch (error) {
		console.error(error);
	}
};

// db.sync({force:true});
module.exports = {
	db,
	Tags,
	Capture,
	saveMediaLocation,
	saveTags,
	searchMediaTags,
};
