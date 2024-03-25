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

try {
    //console.log(await db.getDetails("debra@gmail.com", ""));
    //db.updateDetails("debra@gmail.com", "debra@yes.com", "Debra", null, "Snitch", "Martin", "hello", null, 1);
} catch (error)
{
    console.log("Error:", error);
}

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
    //Check if user (Username/Email exists)
    //If exists, return error (That user already exists)
    //Else, create a new user (Add to database and hash password)

    try {
        const result = await userDB.registerUser(forename, surname, email, password);
        if (result.ok)
        {
            res.status(200).send("New user created")
        } else if (result.errorType === "duplicate") {
            console.log("Email already in use");
            res.status(400).json({message: "Email already exists", code: 5});
        }
        else {
            console.log(result.message);
            res.status(400).send("Unknown error");
        }

    } catch (error){
        console.log(error);
        res.status(404).send(error);
    }
});

app.post("/login", async (req, res) => {
    //Get details from body
    let email = req.body.email;
    let password = req.body.password;
   
    try {

        let {ok, data, errorType, message} = await userDB.checkUser(email, password);
        // console.log(result.ok, result.data, result.message);

        if (ok)
        {
            // Create a random token to send back
            const token = await jwt.sign(
                {
                    userID: data.user_id,
                    email: data.email,
                    name: `${data.forename} ${data.surname}`,
                },
                "RANDOM-TOKEN",
                {expiresIn: "24h"}
            );
            res.status(201).send({message: "User successfully loged-in", email: email, token});
        }
        else if(errorType === "email"){
            res.status(404).json({message: "Emai not found", code: 10});
        }
        else if(errorType === "password"){
            res.status(404).json({message: "Incorrect password", code: 20});
        }

    } catch (error) {
        // Unknown error occurred
        console.log(error);
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
        console.log(error);
        res.status(404).json({ message: "Incorrect origin", code: 30 });
        return next();
    }

    // Destination is not required (If not supplied, tequilla will look random destination)
    try {
        destinationIATA = await searchLocation(searchData.destination);
    } catch (error)
    {
        console.log("Destinaton not selected/found");
    }

    // if (originIATA) // || !destinationIATA
    // {
    await searchFlight(
        originIATA,
        destinationIATA,
        searchData.from,
        searchData.to,
        "GBP",
        searchData.max_price,
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
            res.status(204).json({ message: "No flights found", code: 50});
        }
    }).catch((error) => {
        //console.log(error); 
        res.status(400).json({ message: error, code: 100});
    });
    // } else {
    //     console.log("Location not found");
    //     res.status(400).json({ message: "Invalid Origin", code: 40 });
    // }
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
                res.status(400);
            }
        } catch (error) {
            console.log(error);
        }

        //res.status(200).json(flightsDatabase);

    }
    else {
        res.status(200).send("User not found");
    }

});

app.delete("/saved/flights", auth, async (req, res) => {
    if (req.user) {
    
        try {
            const result = await flightDB.deleteFlightByID(req.user.userID, req.query.flightID);

            if (result.ok) {
                res.status(200).json({message: "Flight Deleted"});
            } else {
                res.status(404).json({message: "Couldn't delete flight"});
            }
            
        } catch (error)
        {
            res.status(404).json({message: "Couldn't delete flight"});
            console.log(error);
        }

    } else {
        res.status(404).json({message: "User not found"});
    }
});

// app.get("/flight", auth, async(req, res) => {

//     if (req.user)
//     {
//         try {
//             const flight = await flightDB.getFlightByID(req.user.userID, req.query.flightid) 

//             if (flight.ok)
//             {
//                 const formattedFlight = flightDB.formatFlight(
//                     flight.id,
//                     flight.origin_country,
//                     flight.origin_city,
//                     flight.destination_country,
//                     flight.destination_city,
//                     flight.outbound_from,
//                     flight.outbound_to,
//                     flight.max_price,
//                     flight.with_return,
//                     flight.min_stay,
//                     flight.max_stay,
//                 );

//                 console.log(formattedFlight);

//                 res.status(200).json(formattedFlight);   
//             } else
//             {
//                 res.status(400).json({message: "No flights found"});   
//             }
//         }
//         catch (error) {
//             console.log(error);
//             res.status(400).json({message: "Unknown Error"});
//          }
//     }
//     else {
//         res.status(404);
//     }
// })

app.post("/saved/flights/new", auth, async (req, res) => {
    if (req.user)
    {   

        try {
            const result = await flightDB.add(
                req.user.userID,
                req.body.originCountry,
                req.body.originCity,
                req.body.destinationCountry,
                req.body.destinationCity,
                req.body.from,
                req.body.to,
                req.body.maxPrice,
                req.body.return,
                req.body.minStay,
                req.body.maxStay,
            )
    
            if (result.ok) {
                res.status(200).json({ message: result.message });
                
            } else {
                res.status(400).json({ message: result.message });
            }

        } catch (error)
        {
            console.log(error);
            res.status(404).json({message: error})
        }
       
    } else {
        res.status(404).json({message: "User not found"})
    }
});

app.put("/saved/flights/update", auth, async (req, res) => {
    if (req.user) {

        console.log("Hello");
        console.log(req.body);

        try {
            const result = await flightDB.update(
                req.user.userID,
                req.body.id,
                req.body.originCountry,
                req.body.originCity,
                req.body.destinationCountry,
                req.body.destinationCity,
                req.body.from,
                req.body.to,
                req.body.maxPrice,
                req.body.return,
                req.body.minStay,
                req.body.maxStay,
            );

            if (result.ok) { 
                res.status(200).json({ message: result.message });
            } else {
                res.status(400).json({ message: result.message });
            }

        } catch (error)
        {
            console.log(error);
            res.status(404).json({ message: error });
        }


    } else {
        res.status(404).json({ message: "Bad" })
    }
});

app.get("/account", auth, async (req, res, next) => {
    if (req.user) {
        const userID = req.user.userID;
        //console.log("User ID: ", userID);

        try {
            const result = await userDB.getDetails(req.user.email, req.user.password, req.user.userID);

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
                if (result.errorType === "email")
                {
                    console.log(result.message);
                    res.status(404).json({message: "Email not found"});

                } else if (result.errorType === "password") {
                    console.log(result.message);
                    res.status(404).json({message: "Incorrect password"});
                }
            }
        } catch (error)
        {
            console.log(error);
        }

    } else {
        res.status(404).json({ message: "User not found" });
    }
})

app.put("/account", auth, async (req, res, next) => {
    if (req.user.userID) {

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
                res.status(404).json({ message: result.message });
            }
        } catch (error)
        {
            res.status(404).json({ message: "Couldn't update details" });
            console.log(error);
        }
    } else {
        console.log("Error");
        res.status(404).json({ message: "User not found" });
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
            res.status(400).json({ message: result.message });
        }
    } else
    {
        res.status(404).json({ message: "User not found" });
    }
});



app.listen(port, (err) => {
    err ? console.log("Error starting server", err) : console.log("Server running on port", port);
})