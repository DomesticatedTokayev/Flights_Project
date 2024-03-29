import React, {useEffect, useState} from "react";
import axios from "axios";
import SearchForm from "../components/SearchForm";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";
import FlightCard from "../components/FlightCard";
import {SearchFlightsWithProps} from "../components/SearchFlights";

function NewFlight() {

    const auth = useAuth();
    const [searching, setSearching] = React.useState(false);
    const [searchingComplete, setSearchComplete] = React.useState(false);
    const [flights, setFlights] = React.useState([]);
    const [searchData, setSearchData] = React.useState();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [id, setID] = React.useState();
    //let [isEditing, setEditing] = React.useState("");

    React.useEffect(() => {
        // Check if editing or creating new flight
        //setEditing(searchParams.get("type"));
        setID(searchParams.get("id"));
    }, []);
    
   
    async function handleSearch(props)
    {
        setSearching(true);
        setSearchComplete(false);

        let result;
        // Only send request when not already searching
        !searching && (result = await SearchFlightsWithProps(props));

        if (result.ok)
        {
            setFlights(result.data);
            setSearchData(props);
        } else {
            switch (result.errorCode)
            {
                case "F30": {
                    alert("Invalid Origin");
                    break;
                }
                case "F40": {
                    alert("No flights found");
                    break;
                }
                case "U10": {
                    alert("Unknown error. Code: 100");
                    break;
                }
                default:{
                    alert("Unknown error");
                    break;
                }
            }   
        }
        
        setSearching(false);
        setSearchComplete(true);
    };

    async function handleAddEditFlight(
            originCity,
            originCountry,
            destinationCity,
            destinationCountry,
            from,
            to,
            maxPrice,
            withReturn,
            minStay,
            maxStay
    ) {
        const body = {
            originCity: originCity,
            originCountry: originCountry,
            destinationCity: destinationCity,
            destinationCountry: destinationCountry,
            from: from,
            to: to,
            maxPrice: parseInt(maxPrice),
            return: withReturn,
            minStay: parseInt(minStay),
            maxStay: parseInt(maxStay),
        };
      
        if (searchParams.get("id") !== null)
        {
            body.id = parseInt(searchParams.get("id"));
        }
            
        const config = {
            method: searchParams.get("id") !== null ? "put" : "post",
            url: "/saved/flights/" + (searchParams.get("id") !== null ? "update" : "new"),
            headers: {
                Authorization: `Bearer ${auth.token}`,
            },
            data: body,
        };
        
        await axios(config)
            .then((result) => {
                //console.log(result)
            })
            .catch(error => {
                console.log(error)
            });
        
        
        // Return to custom flights
        navigate("/custom");
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
                    {(flights.length > 0) && 
                        <>
                        <p className="align-center">Any City</p>
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
                            handleAddFlight={handleAddEditFlight}
                            />
                        </>
                    }
                    {/* Section for specific cities */}
                    <p className="align-center">Specific Cities</p>
                        {flights.map((item, index) => {
                        return <FlightCard
                            key={index}
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
                            handleAddFlight={handleAddEditFlight}
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