const db = require("./db");
const Media = require("./models/Media");
const Tags = require("./models/tags");
const MediaTags = require("./models/MediaTags");

// db.sync({ force: true });

const saveMediaLocation = (location) => {
	const screenCapEntry = Media.findOrCreate({
		where: { location: location },
	});
	return screenCapEntry;
};

const saveTags = async ({ mediaId, tags }) => {
	try {
		tags.forEach(async (tag) => {
			const tagEntry = await Tags.findOrCreate({
				where: { tagName: tag },
			});
			await MediaTags.create({
				tagId: tagEntry[0].dataValues.id,
				mediaId: mediaId,
			});
		});
		console.log(`${tags} have been saved!`);
	} catch (error) {
		console.error(error);
	}
};

module.exports = {
	db,
	Tags,
	Media,
	saveMediaLocation,
	saveTags,
	MediaTags,
};
