import path from "path"
import { Menu, MenuItem, Tray, nativeImage } from "electron";

import { GetServicesResponse, getServices } from "../api";
import { openSettingsWindow } from "./settings";

type Status = 'ok' | 'update' | 'warning' | 'failure'

let STATUS: Status | "error" = "error"
let FAILURE_MODE = false

export function getImagePath(filename: string) {
  return path.join(__dirname, `assets/${filename}.png`)
}

export function getContextMenu(services: GetServicesResponse) {
  const contextMenu = new Menu
  Object.entries(services).forEach(([label, serviceStatus]) => {
    contextMenu.append(new MenuItem({
      type: 'normal',
      label,
      icon: nativeImage
        .createFromPath(getImagePath(serviceStatus))
        .resize({ height: 16, width: 16 })
    }))
  })
  return contextMenu
}

export function getStatus(services: GetServicesResponse): Status | "error" {
  if (!services) return "error"

  let status: Status = "ok"

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
  tray.setImage(getImagePath("server-refresh"))
  try {
    const services = await getServices();
    STATUS = getStatus(services)

    if (STATUS === "failure" && !FAILURE_MODE) setTrayIconToFailureBlink(tray)
    else tray.setImage(getImagePath("server-" + STATUS))

    contextMenu = getContextMenu(services)
    contextMenu.append(new MenuItem({ type: 'separator' }))
  } catch (error) {
    console.error(error);
    tray.setImage(getImagePath("server-error"))
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

async function setTrayIconToFailureBlink(tray: Tray) {
  FAILURE_MODE = true
  const delay = 300 // ms
  let phase = true

  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  while (STATUS === "failure") {
    tray.setImage(getImagePath(phase ? "server" : "server-failure"))
    phase = !phase
    await sleep(delay)
  }
  FAILURE_MODE = false
}

