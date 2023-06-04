/// <reference path="renderer.d.ts"/>

import './index.css';

const urlInput = document.getElementById("url") as HTMLInputElement
const tokenInput = document.getElementById("token") as HTMLInputElement
const openAtLoginInput = document.getElementById("openAtLogin") as HTMLInputElement
const saveButton = document.getElementById("save") as HTMLButtonElement


window.addEventListener("DOMContentLoaded", async () => {
  const { token, url, openAtLogin } = await window.settingsAPI.getSettings()
  urlInput.value = url
  tokenInput.value = token
  openAtLoginInput.checked = openAtLogin
})

saveButton.addEventListener("click", () => {
  window.settingsAPI.saveSettings({ token: tokenInput.value, url: urlInput.value, openAtLogin: openAtLoginInput.checked })
})
