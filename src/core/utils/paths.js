import { app } from "electron"
import path from "path"

const documentsPath = app.getPath('documents')
const AppFolderName = "Sat Predict"

export const APP_DATA_PATH = path.join(documentsPath, AppFolderName)
export const LOADED_FILES_PATH = path.join(APP_DATA_PATH, "./data/cache/sats/")
export const PREDICTIONS_FILES_PATH = path.join(APP_DATA_PATH, "./data/cache/predictions/")

console.log({
  LOADED_FILES_PATH,
  PREDICTIONS_FILES_PATH,
  APP_DATA_PATH,
})
