import { app } from "electron"
import axios from "axios"
import jspredict from "jspredict"
import moment from "moment"
import bearing from "quadrant-bearing"
import fs from "fs"
import path from "path"
import base64 from "base-64"
import fse from "fs-extra"

import { shortEnglishHumanizer } from "./utils"

import userLocation from "./location.json"
import celestrak from "../data/celestrack.json"

const documentsPath = app.getPath('documents')
const AppFolderName = "Sat Predict"

const LOADED_FILES_PATH = path.join(documentsPath, AppFolderName, "./data/cache/sats/")
const PREDICTIONS_FILES_PATH = path.join(documentsPath, AppFolderName, "./data/cache/predictions/")

console.log({
  LOADED_FILES_PATH,
  PREDICTIONS_FILES_PATH,
})

const TIME_FORMAT = "DD/MM/yyyy HH:mm:ss"
const CACHE_LIFETIME = 3600 * 6 // 6 hours

const defaultPassesWindowStart = () => Date.now() - 60000
const defaultPassesWindowEnd = () => Date.now() + (3600000 * 6)

export const getSatsList = async ({ section = null } = {}) => {
  try {
    const sectionName = section || (celestrak[0] && celestrak[0].section)

    if (!sectionName) {
      console.warn("No section was found in data/celestrack.json...")
      return Promise.resolve(null)
    }

    const sectionInfo = celestrak.find(({ section: s }) => s === sectionName)

    const cachePath = path.join(LOADED_FILES_PATH, `${base64.encode(sectionName)}.cache.json`)

    if (!fs.existsSync(cachePath)) {
      console.log("Creating cache for section:", sectionName)

      await updateCache({ cachePath, url: sectionInfo.url })
    }

    const fileBuffer = fs.readFileSync(cachePath)
    const fileContent = Buffer.from(fileBuffer).toString()
    const { data: rawData, created } = JSON.parse(fileContent)
    const data = base64.decode(rawData)

    const dataSplitted = data.split("\n")
    const dataList  = []

    dataSplitted.forEach((row, index) => {
      if (index % 3 !== 0 || !row) return

      const satName = row.trim()
      const firstRow = dataSplitted[index + 1].trim()
      const secondRow = dataSplitted[index + 2].trim()

      dataList.push({
        satName,
        firstRow,
        secondRow
      })
    })

    return Promise.resolve({
      section: sectionName,
      sats: dataList,
      cache: {
        update: () => cachePath && sectionInfo.url && updateCache({ cachePath, url: sectionInfo.url }),
        isOutdated: moment(created).diff(Date.now() - CACHE_LIFETIME * 1000) < 0,
        hasProblems: Boolean(!cachePath || !sectionInfo.url),
      },
    })
  } catch (e) {
    console.log(`Failed to fetch data from url... section=${section}`)
    console.error(e)

    return Promise.resolve({
      section: null,
      sats: [],
      cache: {
        update: () => null,
        isOutdated: true,
        hasProblems: true,
      }
    })
  }
}

const calculatePasses = async ({ section, start, end } = {}) => {
  const cacheFilename = `${base64.encode(section.section)}.prediction.cache.json`
  const cacheFilePath = path.join(PREDICTIONS_FILES_PATH, cacheFilename)
  const cacheExists = fs.existsSync(cacheFilePath)

  const recalculate = async () => {
    const calcStart = Date.now()

    const passesPromises = section.sats.map(async (sattelite) => {
      const passes = await predictPasses({ sattelite, minimumElevation: 5, start, end })

      return passes.map((pass) => ({
        sattelite,
        pass,
      }))
    })
    const recalculatedData = await Promise.all(passesPromises)

    const calcStop = Date.now()

    const cacheTimingInfo = {
      createdAt: calcStart,
      evaluatedIn: (calcStop - calcStart) / 1000,
      start: start || defaultPassesWindowStart(),
      end: end || defaultPassesWindowEnd(),
    }

    // update/create cache
    fse.outputFileSync(cacheFilePath, JSON.stringify({
      data: recalculatedData,
      ...cacheTimingInfo,
    }, null, 2))

    return Promise.resolve({
      passes: recalculatedData,
      cache: cacheTimingInfo,
    })
  }

  let data

  if (cacheExists) {
    const cacheBuffer = fs.readFileSync(cacheFilePath)
    const cacheContent = Buffer.from(cacheBuffer).toString()
    const { data: passes, end, ...rest } = JSON.parse(cacheContent)

    const shouldRecalculateCache = moment(end).diff(Date.now()) < 0

    if (shouldRecalculateCache) {
      data = await recalculate()
    } else {
      data = {
        passes,
        cache: {
          end,
          ...rest,
        },
      }
    }
  } else {
    data = await recalculate()
  }

  return Promise.resolve(data)
}

export const predictPassesOfSection = async ({ section, start = null, end = null }) => {
  const sectionInfo = await getSatsList({ section })
  const data = await calculatePasses({ section: sectionInfo, start, end })

  return Promise.resolve(data)
}

export const predictPasses = ({
  sattelite,
  start = null,
  end = null,
  minimumElevation = 10,
  location = null,
}) => {
  const tle = `${sattelite.satName}\n${sattelite.firstRow}\n${sattelite.secondRow}`
  const qth = location || [48.522034, 25.036870, .1] // Location. For now defaulted to Ukraine, Kolomyia

  const passStart = start || defaultPassesWindowStart()
  const passEnd = end || defaultPassesWindowEnd()

  try {
    const satInfo = jspredict.observe(tle)

    // Check for possible geostationary sattelite (we should ignore them)
    if (satInfo.altitude > 15000) {
      return Promise.resolve([])
    }

    const transits = jspredict.transits(tle, qth, passStart, passEnd, minimumElevation)

    const formatTime = (timestamp) => ({
      timestamp,
      formatted: moment(timestamp).format(TIME_FORMAT),
    })

    const formatAzimuth = (degress) => ({
      formatted: bearing(Math.round(degress)),
      degress,
    })

    const passes = transits.map(({ start, end, duration, apexAzimuth, maxAzimuth, minAzimuth, ...rest }) => ({
      start: formatTime(start),
      end: formatTime(end),
      maxElevationTime: formatTime(start + (duration / 2)),
      apexAzimuth: formatAzimuth(apexAzimuth),
      maxAzimuth: formatAzimuth(maxAzimuth),
      minAzimuth: formatAzimuth(minAzimuth),
      duration: {
        seconds: duration,
        formatted: shortEnglishHumanizer(duration),
      },
      ...rest,
    }))

    return Promise.resolve(passes)
  } catch (e) {
    return Promise.resolve([])
  }
}

export const getSatInfo = ({ sattelite, location }) => {
  const tle = `${sattelite.satName}\n${sattelite.firstRow}\n${sattelite.secondRow}`
  const qth = location || [userLocation.lat, userLocation.lon, .1] // Location. For now defaulted to Ukraine, Kolomyia

  const satInfo = jspredict.observe(tle, qth)

  // Gotta format this data somehow (like add human readable velocity and etc.)
  return Promise.resolve(satInfo)
}

export const getSatsCategories = () => celestrak.map(({ section }) => section)

const updateCache = async ({ cachePath, url }) => {
  console.log(`Updating cache... ${cachePath}`)

  try {
    const { data } = await axios.get(url, { timeout: 10000 })

    fse.outputFileSync(cachePath, JSON.stringify({
      created: Date.now(),
      data: base64.encode(data),
    }, null, 2), { flag: "w+" })

    return Promise.resolve()
  } catch (e) {
    console.error(e)

    return Promise.reject(e)
  }
}

export const fetchFullData = async () => {
  const failed = []
  const success = []
  let fetched = 0

  const timeStart = Date.now()

  const cachePromises = celestrak.map(async ({ section, url }) => {
    try {
      const cacheFilename = `${base64.encode(section)}.cache.json`
      const cacheFilePath = path.join(LOADED_FILES_PATH, cacheFilename)
      const cacheExists = fs.existsSync(cacheFilePath)

      if (!cacheExists) {
        await updateCache({ cachePath: cacheFilePath, url })
        fetched += 1

        console.log(`Created cache for ${cacheFilename}`)
      } else {
        const cacheBuffer = fs.readFileSync(cacheFilePath)
        const cacheValues = Buffer.from(cacheBuffer).toString()

        const parsedCache = JSON.parse(cacheValues)
        const { created } = parsedCache

        const cacheIsOutdated = moment(created).diff(Date.now() - (CACHE_LIFETIME * 1000)) < 0

        if (cacheIsOutdated) {
          console.log(`Updated outdated cache ${cacheFilename}`)

          fetched += 1
          updateCache({ cachePath: cacheFilePath, url })
        }
      }

      success.push({ section, url })
    } catch (error) {
      console.log(error)

      failed.push({ section, url, error })
    } finally {
      return Promise.resolve()
    }
  })

  await Promise.all(cachePromises)

  const timeEnd = Date.now()
  const cacheGatherTime = (timeEnd - timeStart) / 1000
  const cacheFileInfoPath = path.join(LOADED_FILES_PATH, "./cache.json")

  fs.writeFileSync(cacheFileInfoPath, JSON.stringify({
    lastUpdated: Date.now(),
    failed: failed.length,
    success: success.length,
    cacheGatherTime,
    itemsFetched: fetched,
  }), { flag: "w" })

  return Promise.resolve({
    failed,
    success,
    cacheGatherTime,
    itemsFetched: fetched,
  })
}
