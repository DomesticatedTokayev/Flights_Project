import React, { useEffect, useState } from "react";
import axios from "axios";
// import Cookies from "universal-cookie";
// const cookies = new Cookies();
 import { useAuth } from "../hooks/AuthProvider.js";
import FlightCard from "../components/FlightCard.js";
import Flight from "../components/Flight.js";


import UseOutsideClick from "../components/UseOutsideClick.js";

function CustomFlight() {

    const auth = useAuth();

    const [customFlights, setcustomFlights] = useState([]);
    const [flights, setFlights] = useState([{
        id: 1,
        originCountry:"United Kingdom",
        destinationCountry:"Spain",
        originCity: "London",
        destinationCity: "Barcelona",
        utcDeparture:"2024*03-02",
        utcArrival: "2024-06-20",
        returnUtcDeparture: "2024*03-02",
        returnUtcArrival: "2024-06-20",
        nights:7,
        return: "return",
        price:50,
        link: "https://www.google.com",
    }]);

    useEffect(() => {

        getData();
        
    }, []);

    async function getData() {

        const configuration = {
            method: "get",
            url: "http://localhost:4000/custom",
            headers: {
                Authorization: `Bearer ${auth.token}`,
            },
        };

        let temp = [];
        await axios(configuration)
            .then((result) => {
                temp = result.data;
                setcustomFlights(temp);

                // temp.map((value) => {
                //     flights.push(value);
                // });
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
    }

    function closeSideMenu()
    {
        toggleSideMenu("none");
        // On close, delete flight data
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

    function handleSearch(flightID)
    {
        // get data
        // set searching icon on button
        // use axios to search for flights
        // Show side menu with flight data
        handleOpenMenu()
    }


    // Put this into custom flights. But call it from here
    function handleEdit(flightID) {
        //Either send id or flight data

        window.location.href = `editflight?flightid=${flightID}`;
        
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
                        handleSearch={handleSearch}
                        handleEdit={handleEdit}
                    />
                })}
            </>
            }

            <div ref={ref} className="custom__sidebar sidebar" id="custom__sidebar" onClick={handleSideBarClick}>
                <button onClick={() => toggleSideMenu("none")}>X</button>
        
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

// .then((result) => {
//     //console.log(result.data);
//     data = result.data; 
// })
// .catch((error) => {
//     console.log(error);
//     error = new Error();
// });