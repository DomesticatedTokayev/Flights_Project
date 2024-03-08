import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import auth from "./auth.js"
import cors from "cors";

import {searchLocation, searchFlight} from "./flightSearch.js";

const port = 4000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

let database = [{
    id: 1,
    email: "Tokayev",
    password: "yes"
},
    {
    id: 2,
    email: "Hank",
    password: "no115"
}
];

let database2 = [
    {
        id: 1,
        originCountry: "United Kingdom",
        originCity: "London",
        destinationCountry: "Spain",
        destinationCity: "Barcelona",
        from: "2024-03-20",
        to: "2024-05-20",
        maxPrice: 100,
        return: "return",
        minStay: 7,
        maxStay: 14,
    },
    {
        id: 2,
        originCountry: "United Kingdom",
        originCity: null,
        destinationCountry: "France",
        destinationCity: null,
        from: "2024-03-20",
        to: "2024-05-20",
        maxPrice: 80,
        return: "return",
        minStay: 7,
        maxStay: 14,
    },
    {
        id: 3,
        originCountry: "United Kingdom",
        originCity: "Birmingham",
        destinationCountry: "Germany",
        destinationCity: null,
        from: "2024-03-20",
        to: "2024-05-20",
        maxPrice: 120,
        return: "return",
        minStay: 14,
        maxStay: 21,
    }, {
        id: 4,
        originCountry: "United Kingdom",
        originCity: null,
        destinationCountry: "Germany",
        destinationCity: null,
        from: "02/03/2024",
        to: "10/04/2024",
        maxPrice: 120,
        return: null,
    },

]

app.get("/", (req, res) =>
{
    console.log("Sent Data");
    res.json({ name: "Tokayev" });
})

app.post("/data", (req, res) =>
{
    const data = req.body;

    console.log(data);

    const greetings = "Hello " + data.name;

    res.json({message: greetings});
})

// app.post("/login", (req, res) =>{
//     const data = req.body;

//     const s = data.username ? "success" : "failed";

//     res.json({ status: s, token: "You Loged In" });
// })

app.post("/register", (req, res) => {
    
    let username = req.body.email;
    let password = req.body.password;


    //Check if user (Username/Email exists)
    //If exists, return error (That user already exists)
    //Else, create a new user (Add to database and hash password)
    const newUser = {
        email: username,
        password: password
    }

    console.log(newUser);

    database.push(newUser); 
    //Return a tokon back

    res.status(200).send("New user created")
});

app.post("/login", async (req, res) => {
    //Get details from body
    let username = req.body.email;
    let password = req.body.password;

    console.log(username , password);

    //Check if user exists (Returns >= 0 index if found. -1 if not found)
    const exists = database.findIndex(o => o.email === username);
    //if error (no email found) return error
    if (exists >= 0)
    {
        //Get user details (using temp database)
        const tempDetails = database.find(o => o.email === username);
        // login (Check password)   
        if (tempDetails.password === password)
        {
            //User succesfully loged-in
            
            //Create a random token to send back
            const token = await jwt.sign(
                {
                    userID: tempDetails.id,
                    email: tempDetails.email,
                },
                "RANDOM-TOKEN",
                {expiresIn: "24h"}
            );
            
            res.status(201).send({message: "User successfully loged-in", email: tempDetails.email, token});
        } else {
            //Incorrect password
            res.status(400).send("Incorrect password");
        }
    }
    else
    {
        //user not found  
        res.status(404).send("User not found");
    }
});

// Search for cheap flights
app.post("/searchflights/", async (req, res) => {
    const searchData = req.query;

    let originIATA = "";
    let destinationIATA = "";

    try {
        originIATA = await searchLocation(searchData.origin);
        destinationIATA =  await searchLocation(searchData.destination);
    } catch (error) {
        console.log(error);
        res.status(404).send(error);
    }

    if (originIATA.error === null || destinationIATA.error === null)
    {
        console.log("Location not found");
        res.status(400).send("Location not found");
    } else {
        await searchFlight(
            originIATA,
            destinationIATA,
            searchData.from,
            searchData.to,
            "GBP",
            searchData.maxprice,
            searchData.minstay,
            searchData.maxstay,
            searchData.return,
            1,
            0,
            searchData.outputLimit,
        ).then((result) => {
            if (result.length > 0)
            {
                res.status(200).json(result);
                
                
            } else {
                // No flights found
                res.status(204).send("No flights found");
            }
        }).catch((error) => {
            //console.log(error); 
            res.status(400).send(error);
        });
    }
});

app.get("/custom", auth, (req, res) => {
    console.log("hello?");
    if (req.user)
    {
        const userID = req.user.userID;
        console.log(database2);

        res.status(200).json(database2);
    }
    else {
        res.status(200).send("User not found");
    }

});

app.get("/flight", auth, (req, res) => {

    if (req.user)
    {
        const id = req.query.flightid;
        // Temp: Return test data
        res.status(200).json(database2[0]);     
    }
    else {
        res.status(404);
    }
})

// TESTS -----------------------------------------------------------------------------------------------------
app.get("/free", (req, res)=>
{
    res.json({ message: "Freeloader" });
})

app.get("/auth", auth, (req, res)=>
{
    if (req.user)
    {
        res.json({ message: "Premium" });
    }
    else
    {
        res.status(404).json({ error: "not authenticated" });
    }
})


app.listen(port, (err) => {
    err ? console.log("Error starting server", err) : console.log("Server running on port", port);
})