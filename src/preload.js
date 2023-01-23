const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("tagAPI", {
	onTagUpdate: (callback) => ipcRenderer.on("update-tags", callback),
	saveTags: ({ mediaId, tags }) =>
		ipcRenderer.send("tag-save", { mediaId, tags }),
	mediaTagSearch: (searchTerm) =>
		ipcRenderer.invoke("media-tag-search", searchTerm),
});

contextBridge.exposeInMainWorld("capAPI", {
	sendMediaCap: () => ipcRenderer.send("media-capture", {}),
	onCapture: (callback) => ipcRenderer.on("media-captured", callback),
});

contextBridge.exposeInMainWorld("mainSnipAPI", {
	snipCap: () => ipcRenderer.send("snip-capture", {}),
});
