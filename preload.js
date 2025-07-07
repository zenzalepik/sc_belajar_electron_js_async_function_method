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
  runOpenCmdCheckNodeDanInstallPaket: () => ipcRenderer.send('open-cmd-check-node-dan-install-paket'),
  onOpenCmdCheckNodeDanInstallPaketStatus: (callback) => ipcRenderer.on('open-cmd-check-node-dan-install-paket-status', callback),

  // Open CMD, Check Node, dan Install Package V2
  runOpenCmdCheckNodeDanInstallPaketV2: () => ipcRenderer.send('open-cmd-check-node-dan-install-paket-v2'),
  onOpenCmdCheckNodeDanInstallPaketV2Status: (callback) => ipcRenderer.on('open-cmd-check-node-dan-install-paket-v2-status', callback),

  openCmddanCheckNode: () => ipcRenderer.invoke("open-cmd-dan-check-node"),
});
