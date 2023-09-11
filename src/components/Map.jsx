import { useNavigate, useSearchParams } from 'react-router-dom'

import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'

import styles from './Map.module.css'
import { useEffect, useState } from 'react'
import { useCities } from "../contexts/CitiesContext"
import Button from './Button'
import { useGeolocation } from '../hooks/useGeolocation'

function Map() {
  const {cities} = useCities()
  const [mapPosition, setMapPosition] = useState([40, 0])
  const [searchParams] = useSearchParams()
  // eslint-disable-next-line no-unused-vars
  const {isLoading: isLoadingPosition, position: geolocationPosition, getPosition} = useGeolocation()

  const mapLat = searchParams.get("lat")
  const mapLng = searchParams.get("lng")

  useEffect(function() {
    if (mapLat && mapLng) setMapPosition([mapLat, mapLng])
  }, [mapLat, mapLng])

  useEffect(function () {
    console.log(geolocationPosition);
    if (geolocationPosition) setMapPosition([geolocationPosition.lat, geolocationPosition.lng])
  }, [geolocationPosition])

  return (
    <div className={styles.mapContainer} >
      {!geolocationPosition && <Button type='position' onClick={getPosition}>
        {isLoadingPosition ? 'Loading...' : 'Use your position'}
      </Button>}
      <MapContainer 
      center={mapPosition} 
      zoom={6} 
      scrollWheelZoom={true} 
      className={styles.map}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        { cities.map(city => <Marker position={[city.position.lat, city.position.lng]} key={city.id} > 
          <Popup>
            <span>{city.emoji}</span>
            <span>{city.cityName}</span>
          </Popup>
        </Marker>)}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  )
}

// eslint-disable-next-line react/prop-types
function ChangeCenter({position}) {
  const map = useMap()
  map.setView(position)
  return null
} 

function DetectClick() {
  const navigate = useNavigate()

  useMapEvents({
    click: (e) => {
      console.log(e);
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    }
  })
}

export default Map
