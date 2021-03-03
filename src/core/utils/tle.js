const parseClassification = (classification = '') => {
  const classifications = {
    u: "Unclassified",
    c: "Classified",
    s: "Secret",
  }

  return classifications[classification.toLowerCase()]
}

/*parseTle
  parseTle([
    '1 25544U 98067A   08264.51782528 -.00002182  00000-0 -11606-4 0  2927',
    '2 25544  51.6416 247.4627 0006703 130.5360 325.0288 15.72125391563537',
  ])
*/
export const parseTle = ([firstRow = "", secondRow = ""]) => {
  const classification = firstRow.substring(7, 8)
  const launchYear = firstRow.substring(9, 11)
  const launchNumber = firstRow.substring(12, 14)
  const pieceOfLaunch = firstRow.substring(14, 17)
  const setNumber = firstRow.substring(65, 68)

  const noradId = secondRow.substring(3, 7)
  const inclination = secondRow.substring(9, 16)
  const perigee = secondRow.substring(35, 42)
  const meanMotion = secondRow.substring(53, 63)
  const checksum = secondRow.substring(69, 70)

  return {
    noradId,
    inclination,
    perigee,
    meanMotion,
    checksum,
    launchYear,
    launchNumber,
    pieceOfLaunch,
    setNumber,
    classification: {
      value: classification,
      parsed: parseClassification(classification),
    },
  }
}
