import fs from "fs"
import path from 'path';

import { Settings } from "../models";
import { INITIAL_SETTINGS, SETTINGS_FILE_PATH } from "../config";
import { updateAPISettings } from "../api/client";

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