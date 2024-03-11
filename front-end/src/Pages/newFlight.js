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

    const [id, setID] = React.useState();
    let [isEditing, setEditing] = React.useState("");

    React.useEffect(() => {
        // Check if editing or creating new flight
        setEditing(searchParams.get("type"));
        setID(searchParams.get("id"));
    }, []);
    
   
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
    };

    async function handleAddEditFlight(
            originCity,
            originCountry,
            destinationcity,
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
            destinationcity: destinationcity,
            destinationCountry: destinationCountry,
            from: from,
            to: to,
            maxprice: maxPrice,
            return: withReturn,
            minstay: minStay,
            maxstay: maxStay,
        };
      
        if (searchParams.get("id") !== null)
        {
            body.id = searchParams.get("id");
        }

        // method: searchParams.get("id") !== null ? "put" : "post",
        //     url: "http://localhost:4000/" + searchParams.get("id") !== null ? "update" : "new",
            
        const config = {
            method:"post",
            url: "http://localhost:4000/new",
            headers: {
                Authorization: `Bearer ${auth.token}`,
            },
            data: body,
        };

        await axios(config)
            .then((result) => {
            console.log(result)
        })
            .catch(error => {
            console.log(error)
        })



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
                            handleAddFlight={handleAddEditFlight}
                        />
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