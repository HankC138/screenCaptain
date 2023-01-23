const { contextBridge, ipcRenderer, screen } = require("electron");

contextBridge.exposeInMainWorld("snipAPI", {
    onSnipLoad: (callback)=> ipcRenderer.on("snipSize", callback),
    snipCap: (snipArea) => {
        ipcRenderer.send("snip-cap", snipArea),
        ipcRenderer.send('close')
    }
})