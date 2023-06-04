import { Settings } from "./models"

export interface SettingsAPI {
  getSettings: () => Promise<Settings>
  saveSettings: (settings: Partial<Settings>) => void;
}

declare global {
  interface Window {
    settingsAPI: SettingsAPI
  }
}