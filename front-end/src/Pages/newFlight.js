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

    React.useEffect(() => {
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
        navigate("/saved/flights");
    }

    return<>
    <main>
        <div className="custom_flight">
            {searchParams.get("id") !== null ? 
            <div>
                <h3 className="align-center grey-text">Current Flight</h3>
                <FlightCard 
                    originCountry = {searchParams.get('origin') || ""} 
                    destinationCountry = {searchParams.get('destination') || ""} 
                    from={searchParams.get('from') || ""} 
                    to={searchParams.get('to') || ""}
                    minStay={searchParams.get('minstay') || ""} 
                    maxStay={searchParams.get('maxstay') || ""} 
                    return={searchParams.get('withreturn') || ""} 
                    maxPrice={searchParams.get('maxprice') || ""} 
                    isAddFlight={false}
                    hideOptions={true}
                    />
            </div>
                    : <>
                        <h3 className="align-center grey-text">New Flight</h3>
                </>}
            
            <div className="custom_flight__search">
            <h2 className="align-center">Search Flights</h2>
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
            {(flights && searchingComplete) && <>
                {(flights.length > 0) && 
                    <>
                    <h3 className="align-center">Any City</h3>
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
                    <h3 className="align-center">Specific Cities</h3>
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