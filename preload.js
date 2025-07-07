const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  openCmd: () => ipcRenderer.invoke("open-cmd"),
  cekVersiNode: () => ipcRenderer.invoke("cek-versi-node"),

  // Install Package
  runInstall: () => ipcRenderer.send('install-package'),
  onInstallStatus: (callback) => ipcRenderer.on('install-status', callback),

  // Check and Install
  runCheckAndInstall: () => ipcRenderer.send('check-and-install'),
  onCheckAndInstallStatus: (callback) => ipcRenderer.on('check-and-install-status', callback),

  // Open CMD, Check Node, dan Install Package
  runOpenCmddanCheckNode: () => ipcRenderer.send('open-cmd-dan-check-node'),
  onOpenCmddanCheckNodeStatus: (callback) => ipcRenderer.on('open-cmd-dan-check-node-status', callback),

  openCmddanCheckNode: () => ipcRenderer.invoke("open-cmd-dan-check-node"),
});
