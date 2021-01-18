import React, { useEffect, useState } from 'react'
import './App.css';

import {
    Card,
    CardContent,
    FormControl, MenuItem, Select
  } from '@material-ui/core';
import InfoBox from './components/infobox/InfoBox';
import Map from './components/map/Map';
import Table from './components/table/Table';
import {
    sortData, 
    showDataOnMap, 
    prettyPrinstStat
  } from './components/table/SortTable';
import LinerGraph from './components/linegraph/LineGraph';
import 'leaflet/dist/leaflet.css';


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState([34.80746, -10.4796]);
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries ,SetMapCountries] = useState([])
  const [casesType, setCasesType] = useState("cases")


  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
    });
  }, []);

  // Set all countries name and code to form
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const SORT__DATA = sortData(data)
          setTableData(SORT__DATA)
          setCountries(countries);
          SetMapCountries(data);
          showDataOnMap(data)
        })
    }
    getCountriesData()
  }, [])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    
    setCountry(countryCode)
    
    const url = countryCode === 'worldwide'  
    ?  'https://disease.sh/v3/covid-19/all'
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
    await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setCountry(countryCode);
      setCountryInfo(data);
      

      countryCode === "worldwide"
        ? setMapCenter([34.80746, -10.4796])
        : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    });
    }
    

  return (
    <div className="app">
      <section className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>

          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

        </div>
        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType==='cases'}
            onClick={(e) => setCasesType('cases')}
            title="Coronavirus Cases" 
            cases={prettyPrinstStat(countryInfo.todayCases)} 
            total={prettyPrinstStat(countryInfo.cases)} 
          />
          <InfoBox
            active={casesType==='recovered'}
            onClick={(e) => setCasesType('recovered')}
            title="Recovered" 
            cases={prettyPrinstStat(countryInfo.todayRecovered)} 
            total={prettyPrinstStat(countryInfo.recovered)} 
          />
          <InfoBox
            isRed
            active={casesType==='deaths'}
            onClick={(e) => setCasesType('deaths')}
            title="Deaths" 
            cases={prettyPrinstStat(countryInfo.todayDeaths)} 
            total={prettyPrinstStat(countryInfo.deaths)} 
          />
        </div>
        <Map
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
        />
      </section>
      <section className="app__right">
        <Card>
          <CardContent>
            <h3>Lives Cases by Contry</h3>
            <Table countries={tableData}/>
            <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
            <LinerGraph className="app__graph" casesType={casesType}/>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default App;
