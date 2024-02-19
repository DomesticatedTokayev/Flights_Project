import React, { useEffect, useState } from "react";
import axios from "axios";

function AccountSubscription() {

    const [ message, setMessage] = useState("");

    useEffect(() => {
        // Set config for API call
        const configuration = {
            method: "get",
            url: "http://localhost:4000/free",
        };

        axios(configuration)
            .then((result) => {
                console.log(result.data.message);
                setMessage(result.data.message);
            })
            .catch((error) => {
                console.log(error);
                error = new Error();
            })

    }, []);

    {
        return <main>
            <h2>This is Account Subscription</h2>
            <h3>Message: {message}</h3>
        </main>
    }
}

export default AccountSubscription;