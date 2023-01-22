const {
	app,
	BrowserWindow,
	desktopCapturer,
	ipcMain,
	Menu,
} = require("electron");
const crypto = require("crypto");
const { saveMediaLocation, saveTags, searchMediaTags } = require("../db");

import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const REGION = "us-east-1";
const s3Client = new S3Client({ region: REGION });

if (require("electron-squirrel-startup")) {
	app.quit();
}
let mainWindow = null;
const createWindow = () => {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
		},
	});

	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

	mainWindow.webContents.openDevTools();
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

ipcMain.on("media-capture", (_event, _value) => {
	desktopCapturer
		.getSources({
			types: ["screen", "window"],
			thumbnailSize: { width: 1920, height: 1080 },
		})
		.then((sources) => {
			const captureOptions = Menu.buildFromTemplate(
				sources.map((source) => {
					return {
						label: source.name,
						click: () => sourceSelectedNowCap(source),
					};
				})
			);
			captureOptions.popup();
		});
});

// ipcMain.on("source-selected",
const sourceSelectedNowCap = (source) => {
	const screenPng = source.thumbnail.toPNG();
	const image = source.thumbnail.toDataURL();
	const newUUID = crypto.randomUUID();
	const fileName = `${newUUID}.png`;
	const location = `https://mytestbucketformediacaptain.s3.us-east-1.amazonaws.com/${fileName}`;
	const bucketParams = {
		Bucket: "mytestbucketformediacaptain",
		Key: fileName,
		Body: screenPng,
	};

	(async () => {
		try {
			await s3Client.send(new PutObjectCommand(bucketParams));
			return console.log(
				"Successfully uploaded object: " +
					bucketParams.Bucket +
					"/" +
					bucketParams.Key
			);
		} catch (err) {
			console.log("Error", err);
		}
	})();

	saveMediaLocation(location)
		.then((mediaCapture) => {
			mainWindow.webContents.send("update-tags", mediaCapture[0].toJSON().id);
		})
		.catch(console.error);

	mainWindow.webContents.send("media-captured", image);
};

ipcMain.on("tag-save", (e, value) => {
	saveTags(value);
});

ipcMain.handle("media-tag-search", (e, value) => {
	return searchMediaTags(value);
});
