import { contextBridge, ipcRenderer } from "electron"
import { Settings } from "./models"

contextBridge.exposeInMainWorld('settingsAPI', {
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings: Partial<Settings>) => ipcRenderer.invoke('save-settings', settings)
})

