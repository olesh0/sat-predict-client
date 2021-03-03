import axios from 'axios'
import fse from 'fs-extra'

import { USER_LOCATION_PATH } from "./paths"

export const updateUserCoords = ({ lat, lon, ...rest }) => {
  if (!lat || !lon) return null

  const data = JSON.stringify({ lat, lon, ...rest })

  fse.outputFileSync(USER_LOCATION_PATH, data, { flag: "w+" })

  return {
    lat,
    lon,
    updated: true,
  }
}

export const getUserCoords = async () => {
  const defaultLocation = { lat: 48.483470016064906, lon: 25.042524254113417 } // Ukraine, Kolomyia

  if (!fse.existsSync(USER_LOCATION_PATH)) {
    return Promise.resolve(defaultLocation)
  }

  try {
    const fileBuffer = fse.readFileSync(USER_LOCATION_PATH)
    const userLocationRaw = Buffer.from(fileBuffer).toString()
    const parsedLocation = JSON.parse(userLocationRaw)

    return Promise.resolve(parsedLocation)
  } catch (e) {
    console.error(e)

    return Promise.resolve({
      ...defaultLocation,
      isDefault: true,
    })
  }
}

export const getUserLocation = async () => {
  try {
    const queryOptions = { timeout: 5000 }

    const { data: userIp } = await axios.get('https://api.ipify.org/', queryOptions)
    const { data: userLocation } = await axios.get(`https://ipapi.co/${userIp}/json/`, queryOptions)

    return Promise.resolve({
      location: userLocation,
      ip: userIp,
    })
  } catch (e) {
    console.error(e.response)

    return Promise.resolve(null)
  }
}
