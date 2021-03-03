import path from 'path'
import fs from 'fs'

import { FAVORITES_PATH } from './paths'

const FAVORITES_FILENAME = 'favorites.json'
const FAVORITES_FILE = path.join(FAVORITES_PATH, FAVORITES_FILENAME)

const updateFavorites = (favoritesList = []) => {
  return fs.writeFileSync(FAVORITES_FILE, JSON.stringify(favoritesList), { flag: "w+" })
}

export const getFavoritesList = async () => {
  try {
    const rawData = fs.readFileSync(FAVORITES_FILE)
    const data = Buffer.from(rawData).toString()

    const favorites = JSON.parse(data)

    return Promise.resolve(favorites)
  } catch (e) {
    return Promise.resolve([])
  }
}

export const lookupFavorite = async (noradId) => {
  if (!noradId) return Promise.reject()

  const favoritesList = await getFavoritesList()

  return favoritesList.find(({ noradId: id }) => id === noradId) || null
}

export const toggleFavorite = async (data) => {
  console.log(data)

  if (!data) return Promise.reject()

  try {
    const favoritesList = await getFavoritesList()
    const favoriteExists = favoritesList.find(({ noradId }) => noradId === data.noradId)

    let updatedList

    // Delete if exists
    if (favoriteExists) {
      console.log('exists...', favoriteExists)

      updatedList = favoritesList.filter(({ noradId }) => noradId !== data.noradId)

      updateFavorites(updatedList)

      return Promise.resolve(null)
    }

    // In other case: add in
    updatedList = [
      data,
      ...favoritesList,
    ]

    updateFavorites(updatedList)

    return Promise.resolve(data)
  } catch (e) {
    console.error(e)

    return Promise.resolve(null)
  }
}
