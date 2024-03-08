import React, {useEffect, useState} from "react";
import axios from "axios";
import SearchForm from "../components/SearchForm";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";
import FlightCard from "../components/FlightCard";
import Flight from "../components/Flight";

function NewFlight() {

    const auth = useAuth();
    const [searching, setSearching] = React.useState(false);
    const [searchingComplete, setSearchComplete] = React.useState(false);
    const [flights, setFlights] = React.useState([]);
    const [searchData, setSearchData] = React.useState();

    const [searchParams] = useSearchParams();

    let [isEditing, setEditing] = React.useState("");

    React.useEffect(() => {
        // Check if editing or creating new flight
        setEditing(searchParams.get("type"));
        
    }, []);
    
    // Go into flight card (Or from callback)
    // async function createNewFlight(flightID) {
    //     const config = {
    //         method: "get",
    //         url: "http://localhost:3000/flight",
    //         params: {
    //             flightid: flightID
    //         },
    //         headers:
    //         {
    //             Authorization: `Bearer ${auth.token}`
    //         },

    //     };

       // console.log(config);

        // await axios(config)
        //     .then(result => {
        //         //console.log(result.data);
        //         //setFlight(result.data);
        //     })
        //     .catch(error => {
        //         console.log("Axios", error.message);
        //     });
    //}

   // console.log("Flights:", flight);

    async function handleSearch(props)
    {
        // Set journey from country to country only (Any airport)
        // Load available destinations from city/country to city/country

        setSearching(true);
        setSearchComplete(false);



        // use axios to search for flights
        const query = {
            origin: props.origin,
            destination: props.destination,
            from: props.from,
            to: props.to,
            maxprice: props.maxPrice,
            return: props.return,
            minstay: props.minStay,
            maxstay: props.maxStay,
        };
        const config = {
            method: "post",
            url: "http://localhost:3000/searchflights",
            params: query,
        };

        await axios(config)
            .then(result => {
                setFlights(result.data);
                setSearchData(props);

            })
            .catch(error => {
                console.log(error);
            });
        
        setSearching(false);
        setSearchComplete(true);

        //console.log(searchData);
    };

    function handleAddFlight() {
        
    }
    

    // When setting flight data, form isn't updated immediatly
    return<>
    <main>
        <div className="custom_flight">
            <div className="custom_flight__search">
                <SearchForm
                        origin={searchParams.get('origin') || ""} 
                    destination={searchParams.get('destination') || ""} 
                    from={searchParams.get('from') || ""} 
                    to={searchParams.get('to') || ""} 
                    return={searchParams.get('withreturn') || ""} 
                    maxPrice={searchParams.get('maxprice') || ""} 
                    minStay={searchParams.get('minstay') || ""} 
                    maxStay={searchParams.get('maxstay') || ""} 
                    outputLimit={10}
                    onSearch={handleSearch}
                    isSearching={searching}
                />
                </div>
                <div className="custom_flight__found-flights">
                {(flights.length <= 0 && searchingComplete) && <p className="align-center">No Flights found</p>}
                    {/* Add to any city only */}
                {(flights && searchingComplete) && <>
                    <p className="align-center">Any City</p>
                    {flights.length > 0 && 
                        <FlightCard 
                            originCountry = {flights[0].originCountry}
                            destinationCountry = {flights[0].destinationCountry}
                            from={searchData.from}
                            to={searchData.to}
                            minStay={searchData.minStay}
                            maxStay={searchData.maxStay}
                            return={searchData.return}
                            maxPrice={searchData.maxPrice}
                            isAddFlight={true}
                            handleAddFlight={handleAddFlight}
                        />
                    }
                    {/* Section for specific cities */}
                    <p className="align-center">Specific Cities</p>
                    {flights.map((item, index) => {
                        return <FlightCard
                            key={index}
                            id={index}
                            originCountry={item.originCountry}
                            originCity={item.originCity}
                            destinationCountry={item.destinationCountry}
                            destinationCity={item.destinationCity}
                            from={searchData.from}
                            to={searchData.to}
                            minStay={searchData.minStay}
                            maxStay={searchData.maxStay}
                            return={searchData.return}
                            maxPrice={searchData.maxPrice}
                            isAddFlight={true}
                            handleAddFlight={handleAddFlight}
                        />
                    })
                    }
                    </>}
                    
                    
                </div>
                 
        </div>
    </main>
    </>
}

export default NewFlight;