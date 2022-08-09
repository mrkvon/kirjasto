type Language = 'en'|'fi'|'sv'|'ru'

type Schedule = {
  Sections: {
    SelfService: {
      times: {Opens: string, Closes: string, Status: 1|2 }[]
    }
  },
  Date: string,
  LongDayname: string,
}

export type Library = {
  Id: string,
  Name: string,
  Email: string,
  Homepage: string,
  Address: {
    Area: string,
    Street: string,
    Zipcode: string,
    Boxnumber: string,
    City: string,
    Coordinates: null|[number, number],
  },
  Phone: { Number: string },
  Picture: { Files: { medium: { url: string }}}, // TODO
  Schedules: Schedule[],
  ServiceIds: string[],
}

const getUri = (language: Language) => `http://localhost:3001/?uri=https://www.helmet.fi/api/LibraryApi/librariesmini/${language}/`
// const getUri = (language: Language) => `https://www.helmet.fi/api/LibraryApi/librariesmini/${language}/`

export const getLibraries = async (language: Language) => {
  const response = await fetch(getUri(language))
  const libraries = await response.json() as Library[]
  for (const library of libraries) {
    try {
      library.Address.Coordinates = await findLibraryCoordinates(library)
    } catch {}
  }
  return libraries
}

const findLibraryCoordinates = async (library: Library) => {
  // find in cache first
  if (coordinates.hasOwnProperty(library.Id)){
    return coordinates[library.Id]
  }
  let osm
  osm = (await searchOSM(library.Name))[0]

  if (!osm) {
    osm = (await searchOSM(`${library.Address.Street}, ${library.Address.City}`))[0]
  }

  if (!osm) {
    console.log(library)
    throw new Error('library not found')
  }

  return [+osm.lat, +osm.lon] as [number, number]
}

type OSMResult = {
  place_id: number,
  lat: string,
  lon: string,
}

export const searchOSM = async (name: string) => {
  const response = await fetch(`https://nominatim.openstreetmap.org/search.php?q=${name}&format=jsonv2`)
  return await response.json() as OSMResult[]
}

const coordinates: { [id: string]: [number, number] } = {
  "84776": [
    60.2655655,
    25.0190937
  ],
  "84779": [
    60.2108404,
    24.7257877
  ],
  "84787": [
    60.2035392,
    24.6587759
  ],
  "84789": [
    60.2286897,
    24.6205169
  ],
  "84790": [
    60.18802955,
    24.594942816641744
  ],
  "84791": [
    60.2036021,
    24.6576536
  ],
  "84793": [
    60.20392715,
    24.805465948304693
  ],
  "84794": [
    60.2455062,
    24.76924250188175
  ],
  "84795": [
    60.2273781,
    24.7421849
  ],
  "84833": [
    60.3059722,
    24.7398113
  ],
  "84834": [
    60.1600971,
    24.7391875
  ],
  "84845": [
    60.2745782,
    25.0341292
  ],
  "84847": [
    60.2387865,
    24.8759076
  ],
  "84848": [
    60.17963235,
    25.05137218111829
  ],
  "84850": [
    60.1775632,
    24.8044913
  ],
  "84851": [
    60.18334745,
    24.917451367303265
  ],
  "84852": [
    60.249305,
    24.9412671
  ],
  "84853": [
    60.271164,
    25.058815
  ],
  "84854": [
    60.2605061,
    25.0762760519889
  ],
  "84855": [
    60.2018361,
    24.89487035336522
  ],
  "84856": [
    60.261681,
    25.2113244
  ],
  "84857": [
    60.2311911,
    24.933162
  ],
  "84858": [
    60.2498002,
    24.9912196
  ],
  "84859": [
    60.2502645,
    25.0148191
  ],
  "84860": [
    60.183609950000005,
    24.953631800000004
  ],
  "84861": [
    60.21083285,
    24.947132847268136
  ],
  "84862": [
    60.2281294,
    24.962596353729815
  ],
  "84863": [
    60.2377166,
    25.0851575
  ],
  "84864": [
    60.1587032,
    24.8832846
  ],
  "84865": [
    60.2261165,
    24.860429
  ],
  "84866": [
    60.2464096,
    24.86033314084276
  ],
  "84867": [
    60.1968424,
    24.875806796725662
  ],
  "84868": [
    60.1945206,
    25.0528138
  ],
  "84869": [
    60.2773539,
    25.1031716
  ],
  "84870": [
    60.1922199,
    24.962397209719946
  ],
  "84871": [
    60.1466442,
    24.9867462
  ],
  "84872": [
    60.2962007,
    25.058354982539427
  ],
  "84873": [
    60.3239011,
    25.0575654
  ],
  "84874": [
    60.3517602,
    25.0761713
  ],
  "84875": [
    60.2463462,
    25.1150379
  ],
  "84876": [
    60.2771136,
    24.8518626
  ],
  "84877": [
    60.2566971,
    24.805457783527277
  ],
  "84878": [
    60.213889699999996,
    24.891785843
  ],
  "84879": [
    60.2324917,
    24.8873685
  ],
  "84880": [
    60.2088023,
    25.1435848
  ],
  "84881": [
    60.2755337,
    24.9973891
  ],
  "84882": [
    60.2847732,
    24.9590102
  ],
  "84883": [
    60.2241485,
    25.0731173
  ],
  "84884": [
    60.2507183,
    24.8517707
  ],
  "84911": [
    60.1950787,
    25.0335278
  ],
  "84912": [
    60.1662008,
    24.9462164
  ],
  "84915": [
    60.16767395,
    24.663527220466364
  ],
  "84916": [
    60.1378193,
    24.6729273
  ],
  "84917": [
    60.168715,
    24.6147976
  ],
  "84918": [
    60.1600924,
    24.7829586
  ],
  "84919": [
    60.2275287,
    25.0130252
  ],
  "84920": [
    60.2613074,
    24.8538197
  ],
  "84921": [
    60.20899,
    24.9764087
  ],
  "84922": [
    60.29500315,
    25.042450035715966
  ],
  "84923": [
    60.2007754,
    24.9358785
  ],
  "84924": [
    60.2007754,
    24.9358785
  ],
  "84925": [
    60.2174829,
    24.8095368
  ],
  "84926": [
    60.29500315,
    25.042450035715966
  ],
  "84927": [
    60.2119619,
    25.0803725
  ],
  "86000": [
    60.2174829,
    24.8095368
  ],
  "86406": [
    60.1599869,
    24.9208571
  ],
  "86407": [
    60.19037315,
    24.739959652189242
  ],
  "86476": [
    60.173940349999995,
    24.937981609237305
  ],
  "86654": [
    60.1842318,
    24.8187519
  ],
  "86659": [
    60.3149227,
    24.8484747
  ],
  "86685": [
    60.149657,
    24.654763
  ]
}
