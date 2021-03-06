import fs from 'fs'

import { APP_DATA_FILE_PATH } from './paths'
import { DEFAULT_USER_THEME } from '../constants'
import Themes from '../../assets/themes.json'

export const readThemesList = () => {
  return Themes
}

export const readAppData = async () => {
  try {
    const appDataFileRaw = fs.readFileSync(APP_DATA_FILE_PATH)
    const rawData = Buffer.from(appDataFileRaw).toString()
    const data = JSON.parse(rawData)

    return Promise.resolve(data)
  } catch (e) {
    console.error(e)

    return Promise.resolve(null)
  }
}

export const getUserTheme = async () => {
  const appData = await readAppData()
  const themeCamelCaseName = (appData && appData.theme) || DEFAULT_USER_THEME
  const themeData = Themes.find(({ name }) => themeCamelCaseName === name.camelCase)

  return Promise.resolve(themeData)
}
