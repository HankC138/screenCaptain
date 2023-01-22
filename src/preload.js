// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("mediaCapListener", {
	mediaCaptureEvent: (callback) => ipcRenderer.on("media-captured", callback),
});

contextBridge.exposeInMainWorld("updatedTags", {
	updateTagsEvent: (callback) => ipcRenderer.on("update-tags", callback),
});

contextBridge.exposeInMainWorld("mediaCapture", {
	sendMediaCapture: () => ipcRenderer.send("media-capture", {}),
});

contextBridge.exposeInMainWorld("tagsSave", {
	sendTags: ({mediaId, tags})=> ipcRenderer.send("tag-save", {mediaId, tags})
});

contextBridge.exposeInMainWorld("search", {
	mediaTagSearch: (searchTerm)=> ipcRenderer.invoke("media-tag-search", searchTerm)
});

contextBridge.exposeInMainWorld("snipCapture", {
	takeSnip: ()=> ipcRenderer.send("snip-capture", {})
});