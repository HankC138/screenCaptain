const { contextBridge, ipcRenderer } = require("electron");

//exposed API for all Tag related functions
	//onTagUpdate listens for update event, saveTags sends a call to save, mediaTagSearch sends a query and receives the returned promise
contextBridge.exposeInMainWorld("tagAPI", {
	onTagUpdate: (callback) => ipcRenderer.on("update-tags", callback),
	saveTags: ({ mediaId, tags }) =>
		ipcRenderer.send("tag-save", { mediaId, tags }),
	mediaTagSearch: (searchTerm) =>
		ipcRenderer.invoke("media-tag-search", searchTerm),
});

//exposed API for all capture related functions
	//sendMediaCap takes the actual cap, onCapture listens for that event
contextBridge.exposeInMainWorld("capAPI", {
	sendMediaCap: () => ipcRenderer.send("media-capture", {}),
	onCapture: (callback) => ipcRenderer.on("media-captured", callback),
});

//exposed API for only the activation of snip mode
contextBridge.exposeInMainWorld("mainSnipAPI", {
	snipCap: () => ipcRenderer.send("snip-capture", {}),
});
