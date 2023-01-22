const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("snipAPI", {
	snipCap: () => ipcRenderer.send("snipped", {})
})