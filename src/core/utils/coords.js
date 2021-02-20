import fse from "fs-extra"
import path from "path"

import { APP_DATA_PATH } from "./paths"

export const USER_LOCATION_PATH = path.join(APP_DATA_PATH, "./user-geolocation.json")

console.log(USER_LOCATION_PATH)

export const updateUserCoords = ({ lat, lon }) => {
  const data = JSON.stringify({ lat, lon })

  console.log(data, USER_LOCATION_PATH)

  fse.outputFileSync(USER_LOCATION_PATH, data, { flag: "w+" })

  return {
    lat,
    lon,
    updated: true,
  }
}

export const getUserCoords = async () => {
  const defaultLocation = { lat: 48.483470016064906, lon: 25.042524254113417 }

  if (!fse.existsSync(USER_LOCATION_PATH)) {
    return Promise.resolve(defaultLocation)
  }

  try {
    const fileBuffer = fse.readFileSync(USER_LOCATION_PATH)
    const userLocationRaw = Buffer.from(fileBuffer).toString()
    const parsedLocation = JSON.parse(userLocationRaw)

    console.log("USER LOCATION: ", parsedLocation)

    return Promise.resolve(parsedLocation)
  } catch (e) {
    console.error(e)

    return Promise.resolve(defaultLocation)
  }
}
