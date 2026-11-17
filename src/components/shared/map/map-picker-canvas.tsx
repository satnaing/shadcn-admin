import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { DEFAULT_CENTER, type LatLng, roundLatLng, tileLayerFor } from './map.logic'

// A CSS pin instead of leaflet's PNG icons, which bundlers cannot resolve by default.
const pin = L.divIcon({ className: '', html: '<div style="width:18px;height:18px;border-radius:50% 50% 50% 0;background:#e11d48;border:2px solid #fff;transform:rotate(-45deg);box-shadow:0 1px 4px rgba(0,0,0,.5)"></div>', iconSize: [18, 18], iconAnchor: [9, 18] })

function Follow({ value }: { value: LatLng | null }) {
  const map = useMap()
  useEffect(() => {
    if (value) map.setView([value.lat, value.lng], Math.max(map.getZoom(), 13))
  }, [map, value])
  return null
}

function Click({ onPick }: { onPick: (p: LatLng) => void }) {
  useMapEvents({ click: (e) => onPick(roundLatLng({ lat: e.latlng.lat, lng: e.latlng.lng })) })
  return null
}

interface Props {
  value: LatLng | null
  onChange: (p: LatLng) => void
  provider?: string
  tileKey?: string
  disabled?: boolean
}

/** Leaflet map with one draggable marker; a click moves it. Loaded lazily by `MapPicker`. */
export default function MapPickerCanvas({ value, onChange, provider, tileKey, disabled }: Props) {
  const center = value ?? DEFAULT_CENTER
  const tiles = tileLayerFor(provider, tileKey)

  return (
    <MapContainer center={[center.lat, center.lng]} zoom={value ? 13 : 11} className='h-64 w-full rounded-md border' scrollWheelZoom={!disabled}>
      <TileLayer url={tiles.url} attribution={tiles.attribution} />
      <Follow value={value} />
      {!disabled && <Click onPick={onChange} />}
      {value && (
        <Marker
          position={[value.lat, value.lng]}
          icon={pin}
          draggable={!disabled}
          eventHandlers={{ dragend: (e) => { const p = (e.target as L.Marker).getLatLng(); onChange(roundLatLng({ lat: p.lat, lng: p.lng })) } }}
        />
      )}
    </MapContainer>
  )
}
