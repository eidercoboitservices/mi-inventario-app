const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  backup: () => ipcRenderer.invoke('backup'),
  restore: () => ipcRenderer.invoke('restore')
});