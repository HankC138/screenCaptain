const { app, BrowserWindow, desktopCapturer, ipcMain } = require("electron");
const { writeFile } = require("fs");
const crypto = require("crypto");
const { saveMediaLocation, saveTags } = require("../db");

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
			types: ["screen"],
			thumbnailSize: { width: 1920, height: 1080 },
		})
		.then((sources) => {
			const screenPng = sources[0].thumbnail.toPNG();
			const image = sources[0].thumbnail.toDataURL();
			const location = `${process.cwd()}/mediaCaptures/${crypto.randomUUID()}.png`;
			writeFile(location, screenPng, (err) => {
				if (err) throw err;
				console.log("The file has been saved!");
			});

			saveMediaLocation(location)
				.then((mediaCapture) => {
					mainWindow.webContents.send(
						"update-tags",
						mediaCapture[0].toJSON().id
					);
				})
				.catch(console.error);

			mainWindow.webContents.send("media-captured", image);
		})
		.catch(console.error);
});

ipcMain.on("tag-save", (e, value) => {
	saveTags(value);
});
