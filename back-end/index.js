import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const port = 4000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

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


app.listen(port, (err) => {
    err ? console.log("Error starting server", err) : console.log("Server running on port", port);
})