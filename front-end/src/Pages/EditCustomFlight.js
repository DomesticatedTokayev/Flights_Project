import React, {useEffect, useState} from "react";
import axios from "axios";
import SearchForm from "../components/SearchForm";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";

function EditCustomFlight() {
    const auth = useAuth();

    const [searching, setSearching] = React.useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [flight, setFlight] = React.useState([]);

    React.useEffect(() => {
        let id = searchParams.get("flightid");
        // Use ID to get flight data from server database

        getFlightData(id);
    }, []);


    async function getFlightData(flightID) {
        const config = {
            method: "get",
            url: "http://localhost:3000/flight",
            params: {
                flightid: flightID
            },
            headers:
            {
                Authorization: `Bearer ${auth.token}`
            },

        };

       // console.log(config);

        await axios(config)
            .then(result => {
                //console.log(result.data);
                setFlight(result.data);
            })
            .catch(error => {
                console.log("Axios", error.message);
            });
    }

    console.log("Flights:", flight);

    function handleSearch(props)
    {
        
    };
    

    // When setting flight data, form isn't updated immediatly
    return<>
    <main>
        <div className="custom_flight">
            <h1>Custom Flight</h1>
                <div className="custom_flight__search">
                    {console.log("Within return", flight.originCity)}
                <SearchForm
                    origin={flight.originCity ? flight.originCity: flight.originCountry}
                    destination={flight.destinationCity ? flight.destinationCity: flight.destinationCountry}
                    from={flight.from}
                    to={flight.to}
                    return={flight.return? "Return" : "One-Way"}
                    maxPrice={flight.maxPrice}
                    minStay={flight.minStay}
                    maxStay={flight.maxStay}
                    outputLimit={10}
                    onSearch={handleSearch}
                    isSearching={searching}
                />
            </div>
        </div>
    </main>
    </>
}

export default EditCustomFlight;