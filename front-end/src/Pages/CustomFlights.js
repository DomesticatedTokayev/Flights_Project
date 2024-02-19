import React, { useEffect, useState } from "react";
import axios from "axios";
// import Cookies from "universal-cookie";
// const cookies = new Cookies();
import {useAuth} from "../hooks/AuthProvider.js";

function CustomFlight() {
    const [message, setMessage] = useState("");
    // const token = cookies.get("TOKEN");

    const auth = useAuth();


    useEffect(() =>
    {
        const configuration = {
            method: "get",
            url: "http://localhost:4000/auth",
            headers: {
                Authorization: `Bearer ${auth.token}`,
            },
        };

        axios(configuration)
            .then((result) => {
                setMessage(result.data.message);
            })
            .catch((error) =>
            {
                console.log(error);
                error = new Error();
        })

    }, [])

    return <main>
        <h2>This is Custom Flight</h2>
        <h3>{message}</h3>
    </main>
}

export default CustomFlight;