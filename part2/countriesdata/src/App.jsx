import {useState, useEffect} from 'react'
import axios from 'axios'


const App = () => {
  const [countries, setCountries] = useState([])
  const [newSearch, setNewSearch] = useState('')
  const [city, setCity] = useState(null)
  const [weather, setWeather] = useState(null)
  const [weatherIcon, setWeatherIcon] = useState(null)
  const [filteredCountries, setFilteredCountries] = useState([])
  const api_key = import.meta.env.VITE_API_KEY
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  },[])

  const handleSearch = (event) => {
    setNewSearch(event.target.value)
    const filtered = countries.filter(country => country.name.common.toLowerCase().includes(event.target.value.toLowerCase()))
    setFilteredCountries(filtered)
  }

  useEffect(() => {
    if (filteredCountries.length === 1){
      const capital = filteredCountries[0].capital
      setCity(capital)
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
        .then(response => {
          setWeather(response.data)
          setCity(null)
          const icon = response.data.weather[0].icon
          const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`
          setWeatherIcon(iconUrl)
        })
    }
  },[filteredCountries])
  
  const showCountry = (countryName) => {
    const filtered = countries.filter(country => country.name.common.toLowerCase().includes(countryName.toLowerCase()))
    setFilteredCountries(filtered)
  }
  return (
    <div className="row justify-content-center align-items-center"> 

      <div className="card col-md-6 mt-5 mb-2">
      <h1 className="text-center card-title">Countries</h1>
      <p className="text-center">find countries <input className="form-control"  onChange={handleSearch} /></p></div>
     
      {filteredCountries.length === 0 && <p className="text-center">No matches for this search.Please type the correct name.</p>}
      {filteredCountries.length > 10 && <p className="text-center">Too many matches, specify another filter</p>}
      {filteredCountries.length <=10 && filteredCountries.length > 1 && (
        <ul className="text-center mt-3">
          {filteredCountries.map(country => (
            <li className="mt-2" key={country.name.common}>{country.name.common} <button className="btn btn-primary" type="submit" onClick={()=>showCountry(country.name.common)}>Show</button></li>
          ))}
        </ul>
      )}
      {filteredCountries.length === 1  && (
        <div className="text-center mt-3">
          <h2>{filteredCountries[0].name.common}</h2>
          <p>capital {filteredCountries[0].capital}</p>
          <p>Area {filteredCountries[0].area}</p>

          <h3>Languages</h3>
          <ul>
            {Object.values(filteredCountries[0].languages).map(language=> (
              <li key={language}>{language}</li>
            ))}
          </ul>
          <img src={filteredCountries[0].flags.png} style={{width: '250px', height: '200px'}} alt={filteredCountries[0].flags.alt} />
          <div className="row justify-content-center">
          <div className="card mt-3 col-md-4 mb-5 weather-card">
          <h2 className="mt-3">Weather in {filteredCountries[0].capital}</h2>
          <p>Temperature: {weather?.main?.temp} Celsius</p>
          <img src={weatherIcon} className="img-fluid" style={{width:'18rem',height:'15rem'}} alt="Weather Icon" />
          <p>Wind: {weather?.wind?.speed} m/s</p>
          </div>
          </div>
        </div>
  )}
   </div>
  )
}

export default App