import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const port = 4000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    origin: "http:/localhost: 4000",
    Credentials: true
}))

app.get("/", (req, res) =>
{
    res.send("Working here");
})


app.listen(port, (err) => {
    err ? console.log("Error starting server", err) : console.log("Server running on port", port);
})