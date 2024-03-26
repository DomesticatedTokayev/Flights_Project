import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import auth from "./auth.js"
import cors from "cors";
import { connectDB, disconnectDB } from "./Database/db.js";
import * as userDB from "./Database/userDB.js"
import * as flightDB from "./Database/flightsDB.js"
import { searchLocation, searchFlight } from "./flightSearch.js";
import { compareSync } from "bcrypt";

const port = 4000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

connectDB();

app.get("/", (req, res) =>
{
    console.log("Sent Data");
    res.json({ name: "Tokayev" });
})

app.post("/register", async (req, res) => {
    
    let email = req.body.email;
    let password = req.body.password;
    let forename = req.body.forename;
    let surname = req.body.surname;

    try {
        const result = await userDB.registerUser(forename, surname, email, password);
        if (result.ok)
        {
            res.status(200).send("New user created")
        } else if (result.errorCode === "D20") {
            res.status(400).json({message: "Email already exists", errorCode: "A5"});
        }
        else {
            res.status(400).json({ message: "Unknown error", errorCode: "A115"});
        }

    } catch (error){
        console.log(error);
        res.status(404).json({ message: error, errorCode: "U10"});
    }
});

app.post("/login", async (req, res) => {
    //Get details from body
    let email = req.body.email;
    let password = req.body.password;
   
    try {

        let result = await userDB.checkUser(email, password);

        if (result.ok)
        {
            // Create a random token to send back
            const token = await jwt.sign(
                {
                    userID: result.data.user_id,
                    email: result.data.email,
                    name: `${result.data.forename} ${result.data.surname}`,
                },
                "RANDOM-TOKEN",
                {expiresIn: "24h"}
            );
            res.status(201).send({message: "User successfully loged-in", email: email, token});
        }
        else if(result.errorCode === "D10"){
            res.status(404).json({message: "Email not found", errorCode: "A10"});
        }
        else if(result.errorCode === "D30"){
            res.status(404).json({message: "Incorrect password", errorCode: "A20"});
        }

    } catch (error) {
        // Unknown error occurred
        console.log(error);
        res.status(404).json({message: error, errorCode: "U10"});
    }
});

// Search for cheap flights
app.get("/search/flights", async (req, res, next) => {
    const searchData = req.query;
    let originIATA = "";
    let destinationIATA = "";

    try {
        originIATA = await searchLocation(searchData.origin);
    } catch (error) {
       // console.log(error);
        res.status(404).json({ message: "Incorrect origin", errorCode: "F30"});
        return next();
    }

    // Destination is not required (If not supplied, tequilla will look random destination)
    try {
        destinationIATA = await searchLocation(searchData.destination);
    } catch (error)
    {
        // console.log("Destinaton not selected/found");
    }

    await searchFlight(
        originIATA,
        destinationIATA,
        searchData.from,
        searchData.to,
        "GBP",
        searchData.maxPrice,
        searchData.min_stay,
        searchData.max_stay,
        searchData.return,
        1,
        0,
        searchData.output_limit,
    ).then((result) => {
        if (result.length > 0)
        {
            res.status(200).json(result);         
        } else {
            res.status(204).json({ message: "No flights found", errorCode: "F40"});
        }
    }).catch((error) => {
        console.log(error); 
        res.status(404).json({ message: error, errorCode: "U10"});
    });
});

app.get("/saved/flights", auth, async (req, res) => {

    if (req.user)
    {
        const userID = req.user.userID;

        try {
            const flights = await flightDB.getAllFlights(userID);

            let formattedFlights = [];
            if (flights.ok) {
                // Format data to send
                flights.data.map((item) => {

                    formattedFlights.push(flightDB.formatFlight(
                        item.id,
                        item.origin_country,
                        item.origin_city,
                        item.destination_country,
                        item.destination_city,
                        item.outbound_from,
                        item.outbound_to,
                        item.max_price,
                        item.with_return,
                        item.min_stay,
                        item.max_stay,
                    ));
                });
                
                //console.log(formattedFlights);
                res.status(200).json(formattedFlights);
            } else {
                console.log(flights.message);
                res.status(400).json({message: "No flights found", errorCode: "S50"});
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({message: error, errorCode: "U10"});
        }
    }
    else {
        failedToAuthenticate(res);
    }

});

app.delete("/saved/flights", auth, async (req, res) => {
    if (req.user) {
        try {
            const result = await flightDB.deleteFlightByID(req.user.userID, req.query.flightID);

            if (result.ok) {
                res.status(200).json({message: "Flight Deleted"});
            } else {
                res.status(404).json({message: "Couldn't delete flight", errorCode: "S60"});
            }
            
        } catch (error)
        {
            res.status(404).json({message: "Couldn't delete flight", errorCode: "U10"});
            console.log(error);
        }
    } else {
        failedToAuthenticate(res);
    }
});

app.post("/saved/flights/new", auth, async (req, res) => {
    if (req.user)
    {   
        try {
            const result = await flightDB.add(
                req.user.userID,
                req.body.originCountry,
                req.body.originCity || null,
                req.body.destinationCountry,
                req.body.destinationCity || null,
                req.body.from,
                req.body.to,
                req.body.maxPrice,
                req.body.return,
                req.body.minStay,
                req.body.maxStay,
            )
            if (result.ok) {
                res.status(200).json({message: "New flight added"}); //.json({ message: result.message })
            } else {
                res.status(400).json({ message: "Couldn't add flight to database", errorCode: "S70" });
            }
        } catch (error)
        {
            console.log(error);
            res.status(404).json({message: error, errorCode: "S10" })
        }
    } else {
        failedToAuthenticate(res);
    }
});

app.put("/saved/flights/update", auth, async (req, res) => {
    if (req.user) {

        console.log("updating");
        try {
            const result = await flightDB.update(
                req.user.userID,
                req.body.id,
                req.body.originCountry,
                req.body.originCity,
                req.body.destinationCountry,
                req.body.destinationCity,
                req.body.from, //
                req.body.to, //
                req.body.maxPrice,
                req.body.return,
                req.body.minStay,
                req.body.maxStay,
            );

            if (result.ok) { 
                res.status(200).json({ message: "Flight updated" });
            } else {
                res.status(400).json({ message: "Couldn't update flight", errorCode: "S80" });
            }

        } catch (error)
        {
            console.log(error);
            res.status(404).json({ message: error, errorCode: "S10"  });
        }
    } else {
        failedToAuthenticate(res);
    }
});

app.get("/account", auth, async (req, res, next) => {
    if (req.user) {
        try {
            const result = await userDB.getDetails(req.user.email, req.user.userID);

            if (result.ok) {
                //console.log(result.data);

                const details = {
                    email: result.data.email,
                    forename: result.data.forename,
                    surname: result.data.surname,
                };

                res.status(200).json(details);
            }
            else { 
                res.status(404).json({message: "User not found", errorCode: "S90"});
            }
        } catch (error)
        {
           //console.log(error);
            res.status(404).json({message: error, errorCode: "U10"});
        }
    } else {
        failedToAuthenticate(res);
    }
})

app.put("/account", auth, async (req, res, next) => {
    if (req.user.userID) {

        // Vaidate email
        const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

        if (!regex.test(req.body.email))
        {   
            res.status(404).json({ message: "Invalid email", errorCode: "S105" });
            return next();
        }

        if (req.body.password) {
            // Password must contain:
            // - At least one Upper case character
            // - At least one digit
            // - At least 8 characters
            const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
            if (!passwordRegex.test(req.body.password))
            {
                res.status(400).json({ message: "New password doesn't meet minimum requirements", errorCode: "S120" });
                return next();
            }
        }
        
        try {
            const result = await userDB.updateDetails(req.user.userID, req.body.email, req.body.forename, req.body.surname, req.body.password);

            if (result.ok)
            {
                const token = await jwt.sign(
                    {
                        userID: req.user.userID,
                        email: result.data.email,
                        name: `${result.data.forename} ${result.data.surname}`,
                    },
                    "RANDOM-TOKEN",
                    {expiresIn: "24h"}
                );

                res.status(200).json({ message: "Data updated", data: result.data, newToken: token, updated: true });
                next();
            } else {
                res.status(404).json({ message: "Unknown error: Couldn't update user", errorCode: "S100" });
            }
        } catch (error)
        {
            console.log(error);
            res.status(404).json({ message: error, errorCode: "U10" });
        }
    } else {
        failedToAuthenticate(res);
    }
});

app.delete("/account", auth, async (req, res) => {
   
    console.log("Deleting user")
    if (req.user) {
        const result = await userDB.deleteUser(req.user.userID);
        if (result.ok)
        {
            res.status(200).json({ message: result.message });
        }
        else {
            res.status(400).json({ message: "Failed to delete account", errorCode: "S110"});
        }
    } else
    {
        failedToAuthenticate(res);
    }
});

app.listen(port, (err) => {
    err ? console.log("Error starting server", err) : console.log("Server running on port", port);
})

function failedToAuthenticate(res) {
    res.status(404).json({ message: "Failed to authenticate" , errorCode: "R10"});
}