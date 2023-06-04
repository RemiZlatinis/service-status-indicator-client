import fs from "fs"
import path from 'path';

import { Settings } from "../models";
import { INITIAL_SETTINGS, SETTINGS_FILE_PATH } from "../config";
import { updateAPISettings } from "../api/client";
import { BrowserWindow } from "electron";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let settingsWindow: BrowserWindow | null = null;

export function readSettings(): Settings {
  try {
    const data = fs.readFileSync(SETTINGS_FILE_PATH, "utf8");
    const settings: Settings = JSON.parse(data);
    return settings;
  } catch (error) {
    console.error("Failed to read settings file:", error);
    return INITIAL_SETTINGS;
  }
}

export function initializeSettings() {
  if (!fs.existsSync(path.dirname(SETTINGS_FILE_PATH))) {
    fs.mkdirSync(path.dirname(SETTINGS_FILE_PATH), { recursive: true });
  }
  if (!fs.existsSync(SETTINGS_FILE_PATH)) {
    console.log("Initialize settings file");
    fs.writeFileSync(
      SETTINGS_FILE_PATH,
      JSON.stringify(INITIAL_SETTINGS),
      { encoding: "utf8" });
  }
  else console.log("Load settings file");
  updateAPISettings(readSettings());
}

export function openSettingsWindow() {
  settingsWindow = new BrowserWindow({
    height: 200,
    width: 400,
    resizable: false,
    icon: "src/assets/server-ok.png",
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    },
  });

  settingsWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  settingsWindow.setMenu(null);

  // prevent the window from closing the app
  settingsWindow.on('close', (event) => {
    event.preventDefault();
    settingsWindow?.hide();
  });

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}

export function saveSettings(app: Electron.App, settings: Partial<Settings>) {
  try {
    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify({ ...readSettings(), ...settings }));
    updateAPISettings(settings)
    app.setLoginItemSettings({
      openAtLogin: settings.openAtLogin
    })
  } catch (error) {
    console.log(`Error on save settings: ${error}`)
  }
}