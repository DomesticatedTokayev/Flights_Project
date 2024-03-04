import React, { useEffect, useState } from "react";
import axios from "axios";
// import Cookies from "universal-cookie";
// const cookies = new Cookies();
 import { useAuth } from "../hooks/AuthProvider.js";
import FlightCard from "../components/FlightCard.js";

function CustomFlight() {
    const [flights, setFlights] = useState([]);


    const auth = useAuth();

    useEffect(() => {

        getData();
        
    }, []);

    async function getData() {

       //setFlights([]);

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

                setFlights(temp); // Doesn't work

                // temp.map((value) => {
                //     flights.push(value);
                // });
            })
            .catch((error) => {
                console.log(error);
                error = new Error();
            });
        
        
        //console.log(flights);
    }

    return <main>
        <div className="custom">
            {(flights.length > 0) && 
            <>
                {flights.map((item, index) => {
                    return <FlightCard 
                        key={index}
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
                    />
                })}
            </>
            }


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