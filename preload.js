const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("APP_ENV", {
  isElectron: true,
});

contextBridge.exposeInMainWorld("windowAPI", {
  minimize: () => ipcRenderer.send("window-minimize"),
  maximize: () => ipcRenderer.send("window-maximize"),
  close: () => ipcRenderer.send("window-close"),
  onWindowState: (callback) =>
    ipcRenderer.on("window-state", (_, state) => callback(state)),
});
