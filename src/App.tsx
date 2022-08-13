import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import type { Library } from './api'
import { getLibraries } from './api'
import './App.css'
import Info from './Info'
import type { MarkerType } from './Map'
import Map from './Map'
import OpeningVisualization from './OpeningVisualization'
import { getTimeRange, libraryOpen } from './time'
import TimeControl from './TimeControl'

function App() {
  const [libraries, setLibraries] = useState<Library[]>([])
  const [selectedLibraryId, setSelectedLibraryId] = useState('')
  const [timeline, setTimeline] = useState(false)
  const [selectedTime, setSelectedTime] = useState(Date.now())

  useEffect(() => {
    getLibraries('fi').then(l => setLibraries(l))
  }, [])

  useEffect(() => {
    console.log(libraries)
    console.log(
      Object.fromEntries(
        libraries.map(library => [library.Id, library.Address.Coordinates]),
      ),
    )
  }, [libraries])

  const selectedLibrary = libraries.find(l => l.Id === selectedLibraryId)
  const [from, to] = getTimeRange(libraries)

  const markers: MarkerType[] = timeline
    ? libraries
        .filter(library => library.Address.Coordinates)
        .map(library => [library, libraryOpen(library, selectedTime)] as const)
        .filter(([, status]) => status)
        .map(([library, open]) => ({
          id: library.Id,
          coordinates: library.Address.Coordinates as [number, number],
          type: open === 1 ? 'open' : open === 2 ? 'self-service' : 'unknown',
        }))
    : libraries
        .filter(library => library.Address.Coordinates)
        .map(library => ({
          id: library.Id,
          coordinates: library.Address.Coordinates as [number, number],
          type: 'general',
        }))

  return (
    <>
      <Map
        markers={markers}
        onSelect={id => setSelectedLibraryId(id)}
        onDeselect={() => setSelectedLibraryId('')}
      />
      {selectedLibrary && <Info library={selectedLibrary} />}
      <OpeningVisualization
        libraries={selectedLibrary ? [selectedLibrary] : libraries}
        time={selectedTime}
      />
      <TimeControl
        active={timeline}
        onToggle={() => setTimeline(isOn => !isOn)}
        from={from}
        to={to - 1}
        time={selectedTime}
        onChangeTime={time => setSelectedTime(time)}
      />
    </>
  )
}

export default App
