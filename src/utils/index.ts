import { Menu, MenuItem, Tray, nativeImage } from "electron";

import { GetServicesResponse, getServices } from "../api";
import { openSettingsWindow } from "./settings";


export function getContextMenu(services: GetServicesResponse) {
  const contextMenu = new Menu
  Object.entries(services).forEach(([label, serviceStatus]) => {
    contextMenu.append(new MenuItem({
      type: 'normal',
      label,
      icon: nativeImage
        .createFromPath(`src/assets/${serviceStatus}.png`)
        .resize({ height: 16, width: 16 })
    }))
  })
  return contextMenu
}

export function getStatus(services: GetServicesResponse) {
  if (!services) return "error"

  let status: 'ok' | 'update' | 'warning' | 'failure' = 'ok'

  const STATUS_PRIORITY = {
    ok: 0,
    update: 1,
    warning: 2,
    failure: 3,
  }

  Object.entries(services).forEach(([_, serviceStatus]) => {
    if (STATUS_PRIORITY[serviceStatus] > STATUS_PRIORITY[status]) {
      status = serviceStatus
    }
  })

  return status
}

export async function refresh(tray: Tray) {
  let contextMenu = new Menu;
  tray.setImage(`src/assets/server-refresh.png`)
  try {
    const services = await getServices();
    const status = getStatus(services)
    tray.setImage(`src/assets/server-${status}.png`)
    contextMenu = getContextMenu(services)
    contextMenu.append(new MenuItem({ type: 'separator' }))
  } catch (error) {
    console.error(error);
    tray.setImage('src/assets/server-error.png')
  } finally {
    contextMenu.append(new MenuItem({
      label: 'Settings', click: () => {
        openSettingsWindow()
      }
    }))
    contextMenu.append(new MenuItem({ role: 'quit' }))
    tray.setContextMenu(contextMenu);
  }
}
