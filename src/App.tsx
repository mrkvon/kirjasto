import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { useLocation, useMatch, useNavigate } from 'react-router-dom'
import type { Library } from './api'
import { getLibraries } from './api'
import './App.css'
import Info from './Info'
import type { MarkerType } from './Map'
import Map from './Map'
import OpeningVisualization from './OpeningVisualization'
import Search from './Search'
import { getTimeRange, libraryOpen } from './time'
import TimeControl from './TimeControl'

function App() {
  const [libraries, setLibraries] = useState<Library[]>([])
  const [timeline, setTimeline] = useState(false)
  const [selectedTime, setSelectedTime] = useState(Date.now())
  const navigate = useNavigate()

  console.log(useLocation())
  const match = useMatch(':id')

  const selectedLibraryId = match ? Number(match.params.id) : null

  console.log(selectedLibraryId)

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

  const handleSelectLibrary = (id: number) => navigate(`/${id}`)
  const handleDeselectLibrary = () => navigate('/')

  const selectedLibrary = libraries.find(l => l.Id === selectedLibraryId)
  console.log(libraries, selectedLibrary)
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

  const selectedMarker: MarkerType | null =
    selectedLibrary && selectedLibrary.Address.Coordinates
      ? {
          id: selectedLibrary.Id,
          coordinates: selectedLibrary.Address.Coordinates,
          type: (['unknown', 'general', 'self-service', 'open'] as const)[
            timeline ? libraryOpen(selectedLibrary, selectedTime) + 1 : 0
          ],
        }
      : null

  // if selected marker is not among markers, add it
  if (selectedMarker && !markers.find(({ id }) => id === selectedMarker.id)) {
    markers.push(selectedMarker)
  }
  return (
    <>
      <Map
        markers={markers}
        selection={selectedMarker?.id ?? null}
        onSelect={handleSelectLibrary}
        onDeselect={handleDeselectLibrary}
      />
      <Search libraries={libraries} onSelect={handleSelectLibrary} />
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
