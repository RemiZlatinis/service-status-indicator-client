import os from "os"
import path from "path"

import { Settings } from "../models";

// ~/.service-status-indicator/settings.json
export const SETTINGS_FILE_PATH = path.join(os.homedir(), ".service-status-indicator", "settings.json");

export const INITIAL_SETTINGS: Settings = {
  openAtLogin: true,
  token: "",
  url: "http://localhost:8000/"
}