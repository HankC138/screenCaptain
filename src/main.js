const {
	app,
	BrowserWindow,
	desktopCapturer,
	ipcMain,
	Menu,
	screen,
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

//create main app window
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

	//load webpack config entry for main window found in forge.config
	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

	//enable dev tools on open
	mainWindow.webContents.openDevTools();
};

app.on("ready", createWindow);

//darwin is specific to macOS
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

//the handling of a media capture event, and building a menu to select source to capture then forward it the the save function
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

//after a source is selected the capture itself is saved, and based on the existence of coordinates or not we conditionally handle the capture call
const sourceSelectedNowCap = (source, coordinates) => {
	const screenPng = coordinates
		? source.thumbnail.crop(coordinates).toPNG()
		: source.thumbnail.toPNG();
	const image = source.thumbnail.toDataURL();
	const newUUID = crypto.randomUUID();
	const fileName = `${newUUID}.png`;
	const location = `https://mytestbucketformediacaptain.s3.us-east-1.amazonaws.com/${fileName}`;
	const bucketParams = {
		Bucket: "mytestbucketformediacaptain",
		Key: fileName,
		Body: screenPng,
	};
//save to s3 cloud storage
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
	//database save call
	saveMediaLocation(location)
		.then((mediaCapture) => {
			mainWindow.webContents.send("update-tags", mediaCapture[0].toJSON().id);
		})
		.catch(console.error);
		//send the resulting cap back to front ot be displayed
	mainWindow.webContents.send("media-captured", image);
};

//listen for tag save call
ipcMain.on("tag-save", (event, value) => {
	saveTags(value);
});

//handling the tag search
ipcMain.handle("media-tag-search", (event, value) => {
	return searchMediaTags(value);
});

//setting up snip window 
let snipWindow = null;
ipcMain.on("snip-capture", (event, value) => {
	const { size } = screen.getPrimaryDisplay();
	snipWindow = new BrowserWindow({
		transparent: true,
		width: size.width,
		height: size.height,
		webPreferences: {
			nodeIntegration: true,
			preload: SNIP_WINDOW_PRELOAD_WEBPACK_ENTRY,
		},
	});
	//load separate renderer process from forge config 
	snipWindow.loadURL(SNIP_WINDOW_WEBPACK_ENTRY);

	snipWindow.once("ready-to-show", () => {
		snipWindow.show();
		mainWindow.hide();
		snipWindow.webContents.send("snipSize", size);
	});
	snipWindow.on("close", (event) => {
		snipWindow = null;
		mainWindow.show();
	});
});

//listening for snip event from snip window
ipcMain.on("snip-cap", (event, { width, height, x, y }) => {
	snipWindow.hide();
	setTimeout(()=> handleSnipCap({ width, height, x, y }),100)
});

//formatting the snip applying sizing
const handleSnipCap = ({ width, height, x, y }) => {
	const parsedW = parseInt(width, 10);
	const parsedH = parseInt(height, 10);
	desktopCapturer
		.getSources({
			types: ["screen"],
			thumbnailSize: { width: 1920, height: 1080 },
		})
		.then((sources) => {
			const coordinates = { x: x, y: y, width: parsedW, height: parsedH };
			const source = sources[0];
			sourceSelectedNowCap(source, coordinates);
		})
		.catch(console.error);
	setTimeout(() => snipWindow.close(), 100);
};

//closing the snip window
ipcMain.on("close-snip", (_event, _value) => {
	setTimeout(() => snipWindow.close(), 100);
});
