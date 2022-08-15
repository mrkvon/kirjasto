import MarkerClusterGroup from '@changey/react-leaflet-markercluster'
import * as L from 'leaflet'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import './App.css'
import blueCircle from './circle_dark_blue.svg'
import grayCircle from './circle_gray.svg'
import greenCircle from './circle_green.svg'
import redCircle from './circle_red.svg'
import mapStyles from './Map.module.scss'

const iconSize = [20, 20] as L.PointTuple
const selectedIconSize = [30, 30] as L.PointTuple

const generalIcon = L.icon({
  iconUrl: blueCircle,
  iconSize,
})

const openIcon = L.icon({
  iconUrl: greenCircle,
  iconSize,
})

const selfServiceIcon = L.icon({
  iconUrl: redCircle,
  iconSize,
})

const unknownIcon = L.icon({
  iconUrl: grayCircle,
  iconSize,
})

const generalIconSelected = L.icon({
  iconUrl: blueCircle,
  iconSize: selectedIconSize,
})

const openIconSelected = L.icon({
  iconUrl: greenCircle,
  iconSize: selectedIconSize,
})

const selfServiceIconSelected = L.icon({
  iconUrl: redCircle,
  iconSize: selectedIconSize,
})

const unknownIconSelected = L.icon({
  iconUrl: grayCircle,
  iconSize: selectedIconSize,
})

export type MarkerType = {
  id: number
  coordinates: [number, number]
  type: 'general' | 'open' | 'self-service' | 'unknown'
}

const MapClick = ({ onClick }: { onClick?: (map: L.Map) => void }) => {
  const map = useMapEvents({
    click() {
      if (onClick) onClick(map)
    },
  })
  return null
}

const Map = ({
  markers,
  selection,
  onSelect,
  onDeselect,
}: {
  markers: MarkerType[]
  selection: number | null
  onSelect: (id: number) => void
  onDeselect: () => void
}) => (
  <MapContainer
    className={mapStyles.container}
    center={[60.1674881, 24.9427473]}
    zoom={11}
  >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
    />
    <MapClick onClick={() => onDeselect()} />
    <MarkerClusterGroup maxClusterRadius={10}>
      {markers.map(marker => {
        const icon =
          marker.type === 'open'
            ? openIcon
            : marker.type === 'self-service'
            ? selfServiceIcon
            : marker.type === 'unknown'
            ? unknownIcon
            : generalIcon

        const iconSelected =
          marker.type === 'open'
            ? openIconSelected
            : marker.type === 'self-service'
            ? selfServiceIconSelected
            : marker.type === 'unknown'
            ? unknownIconSelected
            : generalIconSelected

        return (
          <Marker
            key={marker.id}
            position={marker.coordinates}
            icon={marker.id === selection ? iconSelected : icon}
            eventHandlers={{ click: () => onSelect(marker.id) }}
          ></Marker>
        )
      })}
    </MarkerClusterGroup>
  </MapContainer>
)

export default Map
