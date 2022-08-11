import MarkerClusterGroup from '@changey/react-leaflet-markercluster'
import * as L from 'leaflet'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import type { Library } from './api'
import { getLibraries } from './api'
import './App.css'
import blueCircle from './circle_dark_blue.svg'
import grayCircle from './circle_gray.svg'
import greenCircle from './circle_green.svg'
import redCircle from './circle_red.svg'
import Info from './Info'
import { getTimeRange, libraryOpen } from './time'
import TimeControl from './TimeControl'

const generalIcon = L.icon({
  iconUrl: blueCircle,
  iconSize: [20, 20],
})

const openIcon = L.icon({
  iconUrl: greenCircle,
  iconSize: [20, 20],
})

const selfServiceIcon = L.icon({
  iconUrl: redCircle,
  iconSize: [20, 20],
})

const unknownIcon = L.icon({
  iconUrl: grayCircle,
  iconSize: [20, 20],
})

const MapClick = ({ onClick }: { onClick?: (map: L.Map) => void }) => {
  const map = useMapEvents({
    click() {
      console.log('clicked')
      if (onClick) onClick(map)
    },
  })
  return null
}

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

  const markers = timeline ? (
    <>
      {libraries
        .map(library => [library, libraryOpen(library, selectedTime)] as const)
        .filter(([, status]) => status)
        .filter(([library]) => library.Address.Coordinates)
        .map(([library, open]) => {
          return (
            <Marker
              key={library.Id}
              position={library.Address.Coordinates as [number, number]}
              icon={
                open === 1
                  ? openIcon
                  : open === 2
                  ? selfServiceIcon
                  : unknownIcon
              }
              eventHandlers={{ click: () => setSelectedLibraryId(library.Id) }}
            ></Marker>
          )
        })}
    </>
  ) : (
    <>
      {libraries
        .filter(library => library.Address.Coordinates)
        .map(library => {
          return (
            <Marker
              key={library.Id}
              position={library.Address.Coordinates as [number, number]}
              icon={generalIcon}
              eventHandlers={{ click: () => setSelectedLibraryId(library.Id) }}
            ></Marker>
          )
        })}
    </>
  )

  return (
    <>
      <MapContainer
        center={[60.1674881, 24.9427473]}
        zoom={11}
        style={{ height: '100vh', width: '100vw' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        <MapClick onClick={() => setSelectedLibraryId('')} />
        <MarkerClusterGroup maxClusterRadius={10}>{markers}</MarkerClusterGroup>
      </MapContainer>
      {selectedLibrary && <Info library={selectedLibrary} />}
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
