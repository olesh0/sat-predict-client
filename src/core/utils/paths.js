import { app } from "electron"
import path from "path"

const documentsPath = app.getPath('documents')
const AppFolderName = "Sat Predict"

export const APP_DATA_PATH = path.join(documentsPath, AppFolderName)

export const LOADED_FILES_PATH = path.join(APP_DATA_PATH, "./data/cache/sats/")
export const PREDICTIONS_FILES_PATH = path.join(APP_DATA_PATH, "./data/cache/predictions/")
export const FAVORITES_PATH = path.join(APP_DATA_PATH, "./data/")
export const USER_LOCATION_PATH = path.join(APP_DATA_PATH, "./user-geolocation.json")
export const APP_DATA_FILE_PATH = path.join(APP_DATA_PATH, "./app-data.json")

console.log({
  USER_LOCATION_PATH,
  LOADED_FILES_PATH,
  PREDICTIONS_FILES_PATH,
  APP_DATA_PATH,
  FAVORITES_PATH,
  APP_DATA_FILE_PATH,
})
