import { app, Tray, Menu, MenuItem } from 'electron';

import { initializeSettings, openSettingsWindow } from './utils/settings';
import { refresh } from './utils';
import { REFRESH_INTERVAL } from './config';

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