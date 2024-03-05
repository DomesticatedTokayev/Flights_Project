import jwt from "jsonwebtoken";

export default async (req, res, next) => {
    try {
        //console.log(await req.headers.authorization.split(" ")[1]);
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
        //next();
        next();
    } catch (error) {
        //console.log(error);
    } 
}