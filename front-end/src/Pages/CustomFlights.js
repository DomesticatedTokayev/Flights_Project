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

        const configuration = {
            method: "get",
            url: "http://localhost:4000/custom", //https://run.mocky.io/v3/d6155d63-938f-484c-8d87-6f918f126cd4 //"http://localhost:4000/custom"
            headers: {
                Authorization: `Bearer ${auth.token}`,
            },
        };

        let temp = [];
        await axios(configuration)
            .then((result) => {
                console.log("test", result.data.data);
                temp = result.data.data;
                console.log("in", temp);
                setFlights(temp);
            })
            .catch((error) => {
                console.log(error);
                error = new Error();
            });
            
          
           // console.log("out", flights);

    }

    return <main>
        <div className="custom">
            { console.log("in return", flights)}
            {(flights.length > 0) && 
            <>
                {flights.map((item, index) => {
                    return <FlightCard 
                        key={index}/> 
                })}
            </>
            }
            {/* <button onClick={getData}>load</button> */}

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