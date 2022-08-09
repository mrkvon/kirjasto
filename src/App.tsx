import React, { useEffect, useState } from 'react';
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import './App.css';
import { getLibraries } from './api';
import type {Library} from './api'
import blueCircle from './circle_dark_blue.svg'
import redCircle from './circle_red.svg'
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import { calculateNewValue } from '@testing-library/user-event/dist/utils';
import Info from './Info';

const icon = L.icon({
  iconUrl: blueCircle,
  iconSize: [20, 20],
})

const MapClick = ({ onClick }: { onClick?: (map: L.Map) => void }) => {

  const map = useMapEvents({
    click() {
      console.log('clicked')
      if (onClick)
      onClick(map)
    }
  })
  return null
}

function App() {

  const [libraries, setLibraries] = useState<Library[]>([])
  const [selectedLibraryId, setSelectedLibraryId] = useState('')

  useEffect(() => {
    getLibraries('fi').then(l => setLibraries(l))
  }, [])

  useEffect(() => {
    console.log(libraries)
    console.log(Object.fromEntries(libraries.map(library => [library.Id, library.Address.Coordinates])))
  }, [libraries])

  const selectedLibrary = libraries.find(l => l.Id === selectedLibraryId)

  return (
    <>
    <MapContainer center={[60.1674881,24.9427473]} zoom={11} style={{height: '100vh', width: '100vw'}}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />
      <MapClick onClick={() => setSelectedLibraryId('')}/>
      <MarkerClusterGroup>
        {libraries.filter(library => library.Address.Coordinates).map(library => 
        <Marker key={library.Id} position={library.Address.Coordinates as [number, number]} icon={icon} eventHandlers={{ click: () => setSelectedLibraryId(library.Id)}}>
        </Marker>)}
      </MarkerClusterGroup>
    </MapContainer>
    {selectedLibrary && <Info library={selectedLibrary} />}
    </>
  );
}

export default App;
