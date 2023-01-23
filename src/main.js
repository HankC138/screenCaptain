const {
	app,
	BrowserWindow,
	desktopCapturer,
	ipcMain,
	Menu,
	screen,
} = require("electron");
const { writeFile } = require("fs");
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

let snipWindow = null;
ipcMain.on("snip-capture", (event, value) => {
	snipWindow = new BrowserWindow({
		transparent: true,
		webPreferences: {
			nodeIntegration: true,
			preload: SNIP_WINDOW_PRELOAD_WEBPACK_ENTRY,
		},
	});
	snipWindow.loadURL(SNIP_WINDOW_WEBPACK_ENTRY);
	// snipWindow.webContents.openDevTools();

	snipWindow.once("ready-to-show", () => {
		snipWindow.show();
		mainWindow.hide()
		const { size } = screen.getPrimaryDisplay();
		snipWindow.webContents.send("snipSize", size);
	});
	snipWindow.on("close", () => {
		snipWindow = null;
		mainWindow.show();
	});
});

ipcMain.on("snip-cap", (event, {width, height, x, y}) => {
	// const bounds = snipWindow.getBounds()
	
	console.log({width,height,x,y}, "snipcap");
	desktopCapturer
		.getSources({
			types: ["screen"],
			thumbnailSize: { width: 1920, height: 1080 },
		})
		.then((sources) => {
			const snipPng = sources[0].thumbnail.crop({x:x,y:y,width:parseInt(width),height:parseInt(height)}).toPNG();
			writeFile(
				`${process.cwd()}/src/snipRender/snipCaptures/${crypto.randomUUID()}.png`,
				snipPng,
				(error) => {
					if (error) throw error;
					console.log("The file has been saved!");
				}
			);
		}).catch(console.error);
		
});
