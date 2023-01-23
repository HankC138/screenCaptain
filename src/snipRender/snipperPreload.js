const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("snipAPI", {
    onSnipLoad: (callback)=> ipcRenderer.on("snipSize", callback),
    snipCap: (snipArea) => {
        ipcRenderer.send("snip-cap", snipArea)
    },
    snipCancel:() => ipcRenderer.send("close-snip", {})
})