const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

const { autoUpdater } = require('electron-updater');

app.whenReady().then(() => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify(); // para Verificar y descarga nuevas versiones
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadURL('http://localhost:3000');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// RESPALDO
ipcMain.handle('backup', async () => {
  const { filePath } = await dialog.showSaveDialog({
    title: 'Guardar copia de seguridad',
    defaultPath: 'respaldo-inventario.json',
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });

  if (filePath) {
    const dataPath = path.join(app.getPath('userData'), 'data', 'app.json');
    try {
      const data = fs.readFileSync(dataPath, 'utf8');
      fs.writeFileSync(filePath, data);
    } catch (error) {
      console.error('Error al crear respaldo:', error);
    }
  }
});

// RESTAURAR
ipcMain.handle('restore', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Restaurar respaldo',
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile']
  });

  if (!canceled && filePaths.length > 0) {
    const sourcePath = filePaths[0];
    const targetPath = path.join(app.getPath('userData'), 'data', 'app.json');
    try {
      const data = fs.readFileSync(sourcePath, 'utf8');
      fs.writeFileSync(targetPath, data);
    } catch (error) {
      console.error('Error al restaurar respaldo:', error);
    }
  }
});