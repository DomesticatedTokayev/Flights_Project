import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import auth, {hello} from "./auth.js"
import cors from "cors";

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


//console.log(database.find(o => o.email === "Tokaye"));
//console.log(database.findIndex(o => o.email === "Hank"));

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

app.post("/login", (req, res) => {
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
            const token = jwt.sign(
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

app.get("/free", (req, res)=>
{
    res.json({ message: "Freeloader" });
})

app.get("/auth", auth, (req, res)=>
{
    //console.log(req.headers.authorization);

    if (req.user)
    {
        //User found
        // console.log(req.user);
        //Redirect as required
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