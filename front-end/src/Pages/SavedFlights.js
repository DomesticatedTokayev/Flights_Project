import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import Cookies from "universal-cookie";
// const cookies = new Cookies();
 import { useAuth } from "../hooks/AuthProvider.js";
import FlightCard from "../components/FlightCard.js";
import Flight from "../components/Flight.js";

import UseOutsideClick from "../components/UseOutsideClick.js";
import {SearchFlightsWithParam} from "../components/SearchFlights.js";

function CustomFlight() {
    const auth = useAuth();

    const navigate = useNavigate();

    const [customFlights, setcustomFlights] = useState([]);
    const [flights, setFlights] = useState([]);
    const [searching, setSearching] = React.useState(false);
    const [searchComplete, setSearchComplete] = React.useState(false);
    
    const [entryDeleted, setEntryDeleted] = React.useState(false);

    const [loadingFlights, setLoadingFlights] = React.useState(false);

    function toggleDeleted()
    {
        setEntryDeleted((prevValue) => (!prevValue));
    };

    useEffect(() => {
        setcustomFlights([]);
        getData();
        
    }, [entryDeleted]); // Run on 'delete flight' only

    async function getData() {

        const configuration = {
            method: "get",
            url: "/saved/flights",
            headers: {
                Authorization: `Bearer ${auth.token}`,
            },
        };

        // Set true to show loading icon
        setLoadingFlights(true);

        await axios(configuration)
            .then((result) => {
                setcustomFlights(result.data);
            })
            .catch((error) => {
                console.log(error);
            });
        

        setLoadingFlights(false);
    }

    // Put this into its own function (Repeating code!)
    function toggleSideMenu(setting)
    {
        const sideMenu = document.getElementById("custom__sidebar");
        sideMenu.style.display = setting;
        
        // On close, delete flight data
        setting === "none" && ClearData();
    }

    function closeSideMenu()
    {
        toggleSideMenu("none");
        // On close, delete flight data
        ClearData();
    }

    function ClearData() {
        setFlights([]);
    }

    const ref = UseOutsideClick(closeSideMenu);

    const handleSideBarClick = (event) => {
        // console.log(event);
        // Doesn't Work
        //event.stopPropogation();
    }

    function handleOpenMenu() {
        toggleSideMenu("block");
    }

    async function handleSearch(origin, destination, from, to, max_price, with_Return, min_Stay, max_stay)
    {
        setSearching(true);
        setSearchComplete(false);

        handleOpenMenu();

        let result;
        !searching && (result = await SearchFlightsWithParam(origin, destination, from, to, max_price, with_Return, min_Stay, max_stay));

        if (result.ok)
        {
            setFlights(result.data);
        } else {
            console.log(result);
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
                    alert("Unknown error. Code: U10");
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

    function handleNew(flightID) {
        navigate("/saved/flights/new/flight?type=new");
    }

    function handleEdit(
        id,
        origin,
        destination,
        from,
        to,
        max_price,
        with_return,
        min_stay,
        max_stay,
    )
    {
        const type = "edit";
        navigate(`/saved/flights/edit/flight?id=${id}&origin=${origin}&destination=${destination}&from=${from}&to=${to}&maxprice=${max_price}&withreturn=${with_return}&minstay=${min_stay !== undefined ? min_stay : ""}&maxstay=${max_stay !== undefined ? max_stay : ""}&type=${type}`);
    }

    async function handleDelete(flightID) {
        const config = {
            method: "delete",
            url: "/saved/flights",
            headers: {
                Authorization: `Bearer: ${auth.token}`,
            },
            params: {
                flightID: flightID,
            }
        };

        await axios(config)
            .then(result => {
                console.log(result);
                toggleDeleted()
            })
            .catch(error => {
                console.log(error);
        })

    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////
    // Flight card keeps getting re-rendered when not required

    return <main>
        <div className="custom">
            <h2 className="align-center">Saved Flights</h2>
            <button className="button" onClick={handleNew}>Add New Destination</button>
            
            {loadingFlights ? <div className="loader_slot"><div className="loader"></div></div> : ""}

            {(customFlights.length > 0) && 
                <>
                {customFlights.map((item, index) => {
                    return <FlightCard 
                        key={item.id}
                        id={item.id}
                        originCountry = {item.originCountry}
                        originCity = {item.originCity}
                        destinationCountry = {item.destinationCountry}
                        destinationCity = {item.destinationCity}
                        from={item.from}
                        to={item.to}
                        minStay={item.minStay}
                        maxStay={item.maxStay}
                        return={item.return}
                        maxPrice={item.maxPrice}
                        isAddFlight={false}
                        handleSearch={handleSearch}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                    />
                })}
            </>
            }

            <div ref={ref} className="custom__sidebar sidebar" id="custom__sidebar" onClick={handleSideBarClick}>
                <button className="button round_btn" onClick={() => toggleSideMenu("none")}>X</button>
                {(flights.length <= 0 && searchComplete === false) && <div className="loader_slot"> <div className="loader loader__custom-flight"></div> </div>}
                {(flights.length <= 0 && searchComplete === true) && <div className="loader_slot"> <p>No Flights Found</p></div>}
                {flights.map((item, index) => {
                    return <Flight
                    key={item.id}
                    originCountry={item.originCountry}
                    destinationCountry={item.destinationCountry}
                    originCity={item.originCity}
                    destinationCity={item.destinationCity}
                    utcDeparture={item.utcDeparture}
                    utcArrival={item.utcArrival}
                    returnUtcDeparture={item.returnUtcDeparture}
                    returnUtcArrival={item.returnUtcArrival}
                    nights={item.nights}
                    return={item.return} 
                    price={item.price}
                    link={item.link}
                />
                })
                }
            </div>

        </div>
    </main>
}

export default CustomFlight;
