import React, {useState, useEffect} from "react";
import axios from '../axiosIntance';
import Select from 'react-select'

export const SearchForm = () => {
  const [airports, setAirports] = useState([]);
  const [departure, setDeparture] = useState([]);
  const [arrival, setArrival] = useState([]);
  // eslint-disable-next-line
  const [isSearch, setIsSearch] = useState(false);
  const [validation, setValidation] = useState(false)

  //console.log(departure)
  //console.log(arrival)
  //console.log('search '+isSearch)
  //console.log('validation '+validation)

  useEffect(() => {
    const getAirports = async () => {
      const resultAirport = await axios.get('airports/all');
    
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
    };
    getAirports();
    
  }, []);

  const handleDeparture = (a) => {
    setDeparture(a.label);
    (departure !== arrival) && arrival.length !== 0 && setValidation(true)
  }

  const handleArrival = (b) => {
    setArrival(b.label);
     (departure !== arrival) && departure.length !== 0 && setValidation(true)
  }

  const searchFlight = () => { 
      setIsSearch(true)    
  } 
    
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
               {!validation && ( <div className="validationSearch">Select Airport</div> )}
               {validation && ( <button onClick={searchFlight} type="button" className="btn btn-primary btn-block">Search</button> )}
            </div>
        </div>

        {!isSearch && <div>All Flights</div>}
        
        </>
    )
    
}
