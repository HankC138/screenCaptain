const db = require("./db");
const Capture = require("./models/Capture");
const Tags = require("./models/tags");

Tags.belongsToMany(Capture, { through: "capturetags" });
Capture.belongsToMany(Tags, { through: "capturetags" });

const saveMediaLocation = (location) => {
	const captureEntry = Capture.findOrCreate({
		where: { location: location },
	});
	return captureEntry;
};

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

const searchMediaTags = async (searchTerm) => {
	try {
		const foundTag = await Tags.findAll({
			where: { tagName: searchTerm },
			include: {
				model: Capture,
			},
		});
		console.log('search hit this')
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
