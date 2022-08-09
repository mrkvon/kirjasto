import React, { useEffect, useState } from 'react';
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './App.css';
import { getLibraries } from './api';
import type {Library} from './api'
import blueCircle from './circle_dark_blue.svg'
import redCircle from './circle_red.svg'
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';

const icon = L.icon({
  iconUrl: blueCircle,
  iconSize: [20, 20],
})

function App() {

  const [libraries, setLibraries] = useState<Library[]>([])
  const [selectedLibrary, setSelectedLibrary] = useState('')

  useEffect(() => {
    getLibraries('fi').then(l => setLibraries(l))
  }, [])

  useEffect(() => {
    console.log(libraries)
    console.log(Object.fromEntries(libraries.map(library => [library.Id, library.Address.Coordinates])))
  }, [libraries])

  useEffect(() => {
    console.log(selectedLibrary)
  }, [selectedLibrary])

  return (
    <MapContainer center={[60.1674881,24.9427473]} zoom={11} style={{height: '100vh', width: '100vw'}}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup>
        {libraries.filter(library => library.Address.Coordinates).map(library => 
        <Marker position={library.Address.Coordinates as [number, number]} icon={icon} eventHandlers={{ click: () => setSelectedLibrary(library.Id)}}>
          <Popup>
            {library.Name}
          </Popup>
        </Marker>)}
      </MarkerClusterGroup>
    </MapContainer>
  );
}

export default App;
