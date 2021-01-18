import React from 'react'

import {MapContainer, TileLayer, useMap} from "react-leaflet"
import { showDataOnMap } from '../table/SortTable';
import './Map.css'

function Map({countries, center, zoom, casesType }) {
  
  const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  }
  return (
    <div className="map">
      <MapContainer center={center} zoom={zoom}>
      <ChangeView center={center} zoom={zoom} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
          {showDataOnMap(countries, casesType)}
      </MapContainer>
    </div>
  )
}

export default Map