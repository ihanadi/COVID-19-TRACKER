import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    rgb: "rgb(204,16,52)",
    mulitiplier: 800,
  },

  recovered: {
    hex: "#7DD71D",
    rgb: "rgb(125,215,29)",
    mulitiplier: 1200,
  },

  deaths: {
    hex: "#333333",
    rgb: "rgb(251,68,67)",
    mulitiplier: 2000,
  },
};


export const sortData = (data) =>{
  const SORTED__DATA = [...data];

  SORTED__DATA.sort((a,b) => (a.cases > b.cases) ? -1:1 );

  return SORTED__DATA
};

export const prettyPrinstStat = (stat) => 
  stat ? `+${numeral(stat).format("0,0a")}`: "+0";


export const showDataOnMap = (data, casesType= "cases") => {
  return(
    data.map((country) => (
      <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      pathOptions={{
        color:casesTypeColors[casesType].hex,
        fillColor:casesTypeColors[casesType].hex,

      }}

      radius={
        Math.sqrt(country[casesType] / 10) *
        casesTypeColors[casesType].mulitiplier
      }
      >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            
            style={{ backgroundImage: `url(${country.countryInfo.flag})`}}
            />
          <div className="info-name">
            {country.country}
          </div>
          <div className="info-cases">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-recovered">
            Recoverd: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-dethes">
            Deaths: {country.deaths}
          </div>
        </div>
      </Popup>
    </Circle>
  ))
)}