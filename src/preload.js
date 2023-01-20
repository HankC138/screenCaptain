// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts



const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  setTitle: (title) => ipcRenderer.invoke("set-title", title),
});

contextBridge.exposeInMainWorld("mountListener", {
    captureListen:(callback) => ipcRenderer.on("screenshot-captured", callback)
})
contextBridge.exposeInMainWorld("sendCaptureCommand", {
    sendCapture: () => ipcRenderer.send("screenshot-capture", {})
})