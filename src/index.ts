import { app, Tray, Menu, MenuItem, ipcMain } from 'electron';

import { initializeSettings, openSettingsWindow, readSettings, saveSettings } from './utils/settings';
import { refresh } from './utils';
import { REFRESH_INTERVAL } from './config';
import { Settings } from './models';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

initializeSettings()

app.on('ready', () => {
  const tray = new Tray('src/assets/server.png');

  let contextMenu = new Menu;

  tray.on('click', event => {
    tray.popUpContextMenu();
  });

  contextMenu.append(new MenuItem({
    label: 'Settings', click: openSettingsWindow }))
  contextMenu.append(new MenuItem({ role: 'quit' }))
  tray.setContextMenu(contextMenu);

  refresh(tray)
  setInterval(refresh, REFRESH_INTERVAL, tray)
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('get-settings', readSettings);
ipcMain.handle('save-settings', (e, s) => saveSettings(app, s as Settings));
