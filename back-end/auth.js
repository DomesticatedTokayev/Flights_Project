import jwt from "jsonwebtoken";

export default async (req, res, next) => {
    try {
        // Get token from auth reader
        const token = await req.headers.authorization.split(" ")[1];
 
        //Check if token matches the supposed origin
        const decodedToken = await jwt.verify(
            token,
            "RANDOM-TOKEN"
        );
        // Retrive the user details of the logged in user
        const user = await decodedToken;
        // Pass the user down to the endpoint here
        req.user = user;
        // Pass down functionality to the endpoint
        next();
    } catch (error) {
        // res.status(401).json({
        //     error: new Error("Invalid request"),
        //     message: error.message
        // })
        next();
    };
}