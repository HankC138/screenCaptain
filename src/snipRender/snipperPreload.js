const { contextBridge, ipcRenderer } = require("electron");

//exposed snipper API. onSnipLoad is listening for the window to open, snipCap sends the capture, snipCancel closes the window
contextBridge.exposeInMainWorld("snipAPI", {
    onSnipLoad: (callback)=> ipcRenderer.on("snipSize", callback),
    snipCap: (snipArea) => {
        ipcRenderer.send("snip-cap", snipArea)
    },
    snipCancel:() => ipcRenderer.send("close-snip", {})
})