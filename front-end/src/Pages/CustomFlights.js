import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import Cookies from "universal-cookie";
// const cookies = new Cookies();
 import { useAuth } from "../hooks/AuthProvider.js";
import FlightCard from "../components/FlightCard.js";
import Flight from "../components/Flight.js";

import UseOutsideClick from "../components/UseOutsideClick.js";
import SearchFlights from "../components/SearchFlights.js";

function CustomFlight() {
    const auth = useAuth();

    const navigate = useNavigate();

    const [customFlights, setcustomFlights] = useState([]);
    const [flights, setFlights] = useState([]);
    const [searching, setSearching] = React.useState(false);
    const [searchComplete, setSearchComplete]= React.useState(false);

    // const [flights, setFlights] = useState([{
        
    //     id: 1,
    //     originCountry:"United Kingdom",
    //     destinationCountry:"Spain",
    //     originCity: "London",
    //     destinationCity: "Barcelona",
    //     utcDeparture:"2024*03-02",
    //     utcArrival: "2024-06-20",
    //     returnUtcDeparture: "2024*03-02",
    //     returnUtcArrival: "2024-06-20",
    //     nights:7,
    //     return: "return",
    //     price:50,
    //     link: "https://www.google.com",
    // }]);

    useEffect(() => {

        getData();
        
    }, []); // Run on add new flight, edit flight and delete flight

    async function getData() {

        const configuration = {
            method: "get",
            url: "http://localhost:4000/custom",
            headers: {
                Authorization: `Bearer ${auth.token}`,
            },
        };

        await axios(configuration)
            .then((result) => {
                setcustomFlights(result.data);
            })
            .catch((error) => {
                console.log(error);
                error = new Error();
            });
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

    async function handleSearch(origin, destination, from, to, maxPrice, withReturn, minStay, maxStay)
    {
        setSearching(true);
        setSearchComplete(false);

        handleOpenMenu();


        // use axios to search for flights
        const query = {
            origin: origin,
            destination: destination,
            from: from,
            to: to,
            maxprice: maxPrice,
            return: withReturn,
            minstay: minStay,
            maxstay: maxStay,
        };
        const config = {
            method: "post",
            url: "http://localhost:3000/searchflights",
            params: query,
        };

        await axios(config)
            .then(result => {
                setFlights(result.data);

            })
            .catch(error => {
                console.log(error);
        })
        setSearching(false);
        setSearchComplete(true);

    }


    function handleNew(flightID) {
        //Either send id or flight data

        //window.location.href = `/newflight?flightid=${flightID}`;
        window.location.href = `/newflight?type=new`;

        // replace with navigate (useNavigate)
        //navigate("/custom");
        
    }

    function handleEdit(
        id,
        origin,
        destination,
        from,
        to,
        maxPrice,
        withReturn,
        minStay,
        maxStay,
    )
    {
        const type = "edit";

        window.location.href = `/newflight?id=${id}&origin=${origin}&destination=${destination}&from=${from}&to=${to}&maxprice=${maxPrice}&withreturn=${withReturn}&minstay=${minStay !== undefined ? minStay : ""}&maxstay=${maxStay !== undefined ? maxStay : ""}&type=${type}`;
        
        // replace with navigate (useNavigate)
        //navigate("/custom");
    }

    function handleDelete(flightID) {
        // Send delete request
        console.log("Delete flight ID: ", flightID);
    }

    return <main>
        <div className="custom">
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
            <button className="button" onClick={handleNew}>Add New Destination</button>
        </div>
    </main>
}

export default CustomFlight;
