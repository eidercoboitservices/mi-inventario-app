const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { autoUpdater } = require('electron-updater');

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    icon: path.join(__dirname, 'assets', 'icon.ico'), // ← Icono correcto
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, 'build', 'index.html'));
}

app.whenReady().then(() => {
  createDataFile(); // ← Crear archivo inicial si no existe
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// ✅ Crear archivo app.json si no existe
function createDataFile() {
  const dirPath = path.join(app.getPath('userData'), 'data');
  const dataPath = path.join(dirPath, 'app.json');

  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    if (!fs.existsSync(dataPath)) {
      const defaultData = {
        productos: [],
        configuracion: {}
      };
      fs.writeFileSync(dataPath, JSON.stringify(defaultData, null, 2));
      console.log('Archivo app.json creado en:', dataPath);
    }
  } catch (err) {
    console.error('Error creando archivo de datos:', err);
  }
}

// ✅ RESPALDO
ipcMain.handle('backup', async () => {
  const { filePath } = await dialog.showSaveDialog({
    title: 'Guardar copia de seguridad',
    defaultPath: 'respaldo-inventario.json',
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });

  if (filePath) {
    const dataPath = path.join(app.getPath('userData'), 'data', 'app.json');

    try {
      if (!fs.existsSync(dataPath)) {
        throw new Error('El archivo app.json no existe.');
      }

      const data = fs.readFileSync(dataPath, 'utf8');
      fs.writeFileSync(filePath, data);
      console.log('Respaldo guardado en:', filePath);
    } catch (error) {
      console.error('Error al crear respaldo:', error);
    }
  }
});

// ✅ RESTAURAR
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
      console.log('Respaldo restaurado desde:', sourcePath);
      return true;
    } catch (error) {
      console.error('Error al restaurar respaldo:', error);
      return false;
    }
  }
  return false;
});
