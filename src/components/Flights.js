import React, {useState, useEffect} from "react";
import axios from '../axiosIntance';
import LazyLoad from 'react-lazyload';
import {Preloader} from './Preloader';
import Select from 'react-select';
//import {SearchForm} from './SearchForm'

export const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const [airports, setAirports] = useState([]);
  const [departure, setDeparture] = useState([]);
  const [arrival, setArrival] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [validation, setValidation] = useState(false)
  const [route, setRoute] = useState()
  const [disableSearch, setDisableSearch] = useState(false)

  useEffect(() => {
    const getFlights = async () => {
      setHasError(false);

      try {
        const resultFlights = route ? await axios.get(`flights/from/${departure}/to/${arrival}`) : await axios.get('flights/all');
        route && setIsSearch(true)  
        const resultAirlines = await axios.get('airlines/all');
        const resultAirport = await axios.get('airports/all');
        // eslint-disable-next-line
        const AirlinesMap = resultAirlines.data.data.reduce((map, item) => map.set(item.id, item.name), new Map);

        const AirlineResult = resultFlights.data.data.map((item) => (Object.assign({
          airlineName: AirlinesMap.get(item.airlineId)
        }, item)));
        // eslint-disable-next-line
        const AirportMap = resultAirport.data.data.reduce((map, item) => map.set(item.id, item.codeIata), new Map);

        const AirportResult = AirlineResult.map((item) => (Object.assign({
          departureName: AirportMap.get(item.departureAirportId),
          arrivalName: AirportMap.get(item.arrivalAirportId)
        }, item)));

        function renameKey ( obj, oldKey, newKey ) {
          obj[newKey] = obj[oldKey];
          delete obj[oldKey];
        }
        function deleteKey ( obj, key ) {
          delete obj[key];
        }
  
        resultAirport.data.data.forEach( obj => renameKey( obj, 'id', 'value' ) );
        resultAirport.data.data.forEach( obj => renameKey( obj, 'codeIata', 'label' ) );
        resultAirport.data.data.forEach( obj => deleteKey( obj, 'latitude' ) );
        resultAirport.data.data.forEach( obj => deleteKey( obj, 'longitude' ) );

        setAirports(resultAirport.data.data);
        setFlights(AirportResult);
      } catch (error) {
        console.log('Error: ' + error)
        setHasError(true);
      }
    
      setIsLoading(false);
    };
    getFlights();
    // eslint-disable-next-line
  }, [route]);

  const handleDeparture = (a) => {
    setDeparture(a.label);
    arrival.length !== 0 && setValidation(true)
    setDisableSearch(false)
  }

  const handleArrival = (b) => {
    setArrival(b.label);
     departure.length !== 0 && setValidation(true)
     setDisableSearch(false)
  }

  const searchFlight = () => { 
      setIsLoading(true)
      setDisableSearch(true)
      setRoute(departure + ' - ' + arrival)
  } 
  const numFlights = flights.length

  return (
    <>
  <div className="row searchForm">
    <div className="col-md-4 select">
        <Select
        placeholder={'Departure'}
        isClearable={false}
        isSearchable={true}
        name="departure"
        options={airports} 
        onChange={(e) => handleDeparture(e)}
          />
    </div>
    <div className="col-md-4 select">
        <Select
        placeholder={'Arrival'}
        isClearable={false}
        isSearchable={true}
        name="arrival"
        options={airports}
        onChange={(e) => handleArrival(e)}
        />
    </div>
    <div className="col-md-4 d-flex justify-content-center align-items-center">
        {!validation && ( <div className="validationSearch">Select Airports</div> )}
        {validation && ( <button onClick={searchFlight} type="button" className={ disableSearch ? 'btn btn-primary btn-block disabled' : 'btn btn-primary btn-block'}>Search</button> )}
    </div>
    </div>

  {!isSearch &&  !isLoading && <div className="flightMessage d-flex justify-content-center align-items-center flex-column"><span>All Routes</span> <span>(num. flights: {numFlights})</span></div>}
  {isSearch && !isLoading && <div className="flightMessage d-flex justify-content-center align-items-center flex-column"><span>Route {route}</span> <span>(num. flights {numFlights})</span></div>}
    {isLoading && <Preloader />}
    {!isLoading && hasError && (
        <div>An error occurred in the data retrieval</div>
      )
    }
    {!isLoading && flights && (
        flights.sort((a, b) => a.price - b.price).map((flight) => {
          const { id, price, airlineName, departureName, arrivalName } = flight;
          return (
          <LazyLoad key={id} once={flight.once} height={80} offset={[-80, 0]}>
          <div className="row">
            <div className="col-12 card text-center border-gradient border-gradient-shippypro">
                <div className="card-header">
                    {departureName} - {arrivalName}
                </div>
                <div className="card-body">
                  {!isSearch ? '' : route === (departureName + ' - ' + arrivalName) ? <div>direct flight</div> : <div>stop-overs</div> }
                    <h2 className="card-title">{airlineName}</h2>
                </div>
                <div className="card-footer">
                    € {price}
                </div>
            </div>
          </div>
          </LazyLoad>

          )
                  
        })
      )
    }
    
    </>
  );
}