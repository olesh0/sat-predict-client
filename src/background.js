import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { getSatsCategories, predictPassesOfSection, getSatInfo } from "./core/sattelites"
import { getUserCoords, updateUserCoords, getUserLocation, lookupFavorite } from "./core/utils"

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
])

ipcMain.handle('get-categories', async () => getSatsCategories())

ipcMain.handle('get-predicted-passes', async (_, { section, force }) => {
  console.log(`getting passes of ${section} / force=${force}`)

  return predictPassesOfSection({ section, force })
})

ipcMain.handle('get-user-location', async () => {
  try {
    return getUserLocation()
  } catch (e) {
    console.error(e)

    return null
  }
})

ipcMain.handle('observe-sattelite', (_, sattelite) => getSatInfo({ sattelite }))
ipcMain.handle('update-user-coords', (_, coords) => updateUserCoords(coords))
ipcMain.handle('get-user-coords', () => getUserCoords())
ipcMain.handle('lookup-favorite', (_, noradId) => lookupFavorite(noradId))

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    fullscreen: true,
    webPreferences: {

      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration
      // for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
    },
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)

    //if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
