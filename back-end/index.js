import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import auth from "./auth.js"
import cors from "cors";
import * as db from "./db.js";
import {searchLocation, searchFlight} from "./flightSearch.js";

const port = 4000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

db.connect();

try {
    //console.log(await db.getDetails("debra@gmail.com", ""));
    //db.updateDetails("debra@gmail.com", "debra@yes.com", "Debra", null, "Snitch", "Martin", "hello", null, 1);
} catch (error)
{
    console.log("Error:", error);
}

let userDetailsDatabase = [{
    id: 1,
    email: "Tokayev",
    password: "yes",
    forename: "debra",
    surname: "snitch",
},
    {
    id: 2,
    email: "Hank",
    password: "no115",
    forename: "Mitch",
    surname: "Stitch",
}
];

let flightsDatabase = [
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
        from: "2024-03-20",
        to: "2024-05-20",
        maxPrice: 120,
        return: "oneway",
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
    
    let email = req.body.email;
    let password = req.body.password;
    let forename = req.body.forename;
    let surname = req.body.surname;
    //Check if user (Username/Email exists)
    //If exists, return error (That user already exists)
    //Else, create a new user (Add to database and hash password)

    try {
        db.registerUser(forename, surname, email, password);
    } catch (error){
        console.log(error);
    }

    // console.log("This triggers");

    res.status(200).send("New user created")
});

app.post("/login", async (req, res) => {
    //Get details from body
    let email = req.body.email;
    let password = req.body.password;
   
    try {
        let {ok, data, errorType, message} = await db.checkUser(email, password);
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
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!y
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Send forename and surname here
            res.status(201).send({message: "User successfully loged-in", name: "Replace with name (On server)", token});
        }
        else if(errorType === "email"){
            console.log(message);
        }
        else if(errorType === "password"){
            console.log(message);
        }

    } catch (error) {
        // Unknown error occurred
        console.log(error);
    }


    //Check if user exists (Returns >= 0 index if found. -1 if not found)
    // const exists = userDetailsDatabase.findIndex(o => o.email === email);
    // //if error (no email found) return error
    // if (exists >= 0)
    // {
    //     //Get user details (using temp database)
    //     const tempDetails = userDetailsDatabase.find(o => o.email === email);
    //     // login (Check password)   
    //     if (tempDetails.password === password)
    //     {
    //         //User succesfully loged-in
            
    //         //Create a random token to send back
    //         const token = await jwt.sign(
    //             {
    //                 userID: tempDetails.id,
    //                 email: tempDetails.email,
    //             },
    //             "RANDOM-TOKEN",
    //             {expiresIn: "24h"}
    //         );
    //         //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!y
    //         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Send forename and surname here
    //         res.status(201).send({message: "User successfully loged-in", name: "Replace with name (On server)", token});
    //     } else {
    //         //Incorrect password
    //         res.status(400).send("Incorrect password");
    //     }
    // }
    // else
    // {
    //     //user not found  
    //     res.status(404).send("User not found");
    // }
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
            searchData.maxPrice,
            searchData.minStay,
            searchData.maxStay,
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

    if (req.user)
    {
        const userID = req.user.userID;

        res.status(200).json(flightsDatabase);
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
        res.status(200).json(flightsDatabase[0]);     
    }
    else {
        res.status(404);
    }
})

app.post("/new", auth, (req, res) => {
    if (req.user)
    {   
        const newFlight = {
            id: 5,
            originCountry: req.body.originCountry,
            originCity: req.body.originCity,
            destinationCountry: req.body.destinationCountry,
            destinationCity: req.body.destinationCity,
            from: req.body.from,
            to: req.body.to,
            maxPrice: req.body.maxPrice,
            return: req.body.return,
            minStay: req.body.minStay,
            maxStay: req.body.maxStay,
        }


        flightsDatabase.push(newFlight);

        console.log(flightsDatabase);

        res.status(200).json({message: "New Flight: Good"})
    } else {
        res.status(404).json({message: "Bad"})
    }
});

app.put("/update", auth, (req, res) => {
    if (req.user) {
        console.log(req.body.id);
        flightsDatabase.map((item, index) => {
            if (item.id === req.body.id) {
                flightsDatabase[index] = req.body;
            }
        });

        res.status(200).json({ message: "Update Flight: Good" })
    } else {
        res.status(404).json({ message: "Bad" })
    }
});

app.get("/account", auth, async (req, res, next) => {
    if (req.user) {
        const userID = req.user.userID;
        //console.log("User ID: ", userID);

        try {
            const result = await db.getDetails(req.user.email, req.user.password, req.user.userID);

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

        // // Temp: Find id in database
        // userDetailsDatabase.map((item, index) => {
        //     if (item.id === userID)
        //     {
        //         res.status(200).json(item);
        //         userFound = true;
        //         next();
        //     }
        // });

        // if (!userFound)
        // {
        //     res.status(404).json({message: "User not found in database"});
        // }

    } else {
        res.status(404).json({ message: "User not found" });
    }
})

app.post("/account", auth, async (req, res, next) => {
    if (req.user) {
        try {
            const updatedData = await db.updateDetails(req.body.email, req.body.forename, req.body.surname, null, req.body.password, req.user.userID);
            res.status(200).json({ message: "Data updated", data: updatedData, updated: true });
            next();
        } catch (error)
        {
            res.status(404).json({ message: "Couldn't update details" });
            console.log(error);
        }

        // userDetailsDatabase.map((item, index) => {
        //     if (item.id === userID)
        //     {
        //         item.email = req.body.email;
        //         item.password = req.body.password;
        //         item.forename = req.body.forename;
        //         item.surname = req.body.surname

        //         res.status(200).json({ message: "Data updated", updated: true });
        //         next();
        //     }
        // });

        // res.status(404).json({ message: "Coudn't update details", updated: false });

    } else {
        res.status(404).json({ message: "User not found" });
    }
    
});

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