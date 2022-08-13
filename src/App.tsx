import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { useMatch, useNavigate } from 'react-router-dom'
import { getLibraries, getServices, Library, Service } from './api'
import './App.css'
import Filter from './Filter'
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
  const [services, setServices] = useState<Service[]>([])
  const [filters, setFilters] = useState<number[]>([])

  const match = useMatch(':id')

  const selectedLibraryId = match ? Number(match.params.id) : null

  useEffect(() => {
    getLibraries('en').then(l => setLibraries(l))
    getServices('en').then(s => setServices(s))
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

  const filteredLibraries = libraries.filter(
    library => filters.length === 0 || hasLibraryServices(library, filters),
  )

  const selectedLibrary = libraries.find(l => l.Id === selectedLibraryId)
  const [from, to] = getTimeRange(libraries)

  const markers: MarkerType[] = timeline
    ? filteredLibraries
        .filter(library => library.Address.Coordinates)
        .map(library => [library, libraryOpen(library, selectedTime)] as const)
        .filter(([, status]) => status)
        .map(([library, open]) => ({
          id: library.Id,
          coordinates: library.Address.Coordinates as [number, number],
          type: open === 1 ? 'open' : open === 2 ? 'self-service' : 'unknown',
        }))
    : filteredLibraries
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

  const availableServiceIds = getAvailableServiceIds(libraries)
  const availableServices = services.filter(service =>
    availableServiceIds.includes(service.Id),
  )
  console.log(services.length, availableServiceIds.length, availableServiceIds)

  const handleFilterToggle = (id: number) => {
    setFilters(filters => {
      let newFilters = [...filters]

      if (newFilters.includes(id))
        newFilters = newFilters.filter(fid => fid !== id)
      else newFilters.push(id)

      return newFilters
    })
  }

  const handleFilterRemove = (id: number) => {
    setFilters(filters =>
      filters.includes(id) ? filters.filter(fid => fid !== id) : filters,
    )
  }

  const handleFilterAdd = (id: number) => {
    setFilters(filters => (filters.includes(id) ? filters : [...filters, id]))
  }

  return (
    <>
      <Map
        markers={markers}
        selection={selectedMarker?.id ?? null}
        onSelect={handleSelectLibrary}
        onDeselect={handleDeselectLibrary}
      />
      <Search
        items={libraries}
        onSelectItem={handleSelectLibrary}
        style={{ position: 'absolute', top: 20, left: 50, zIndex: 1000 }}
      />
      <Filter
        options={availableServices.map(service => ({
          id: service.Id,
          name: service.Name,
        }))}
        selectedOptionIds={filters}
        onToggle={handleFilterToggle}
        onAdd={handleFilterAdd}
        onRemove={handleFilterRemove}
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

const getAvailableServiceIds = (libraries: Library[]): number[] =>
  libraries
    .map(({ ServiceIds }) => ServiceIds)
    .flat()
    .filter((id, i, ids) => ids.indexOf(id) === i)

export default App

const hasLibraryServices = (library: Library, services: number[]) =>
  services.every(id => library.ServiceIds.includes(id))
