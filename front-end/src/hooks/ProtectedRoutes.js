import React from "react";
import {Navigate, Outlet } from "react-router-dom";
// import Cookies from "universal-cookie";
// const cookies = new Cookies();

import { useAuth } from "./AuthProvider";

function ProtectedRoutes() {
   
    const user = useAuth();
    
    if (!user.token)
    {
        return <Navigate to="/sign-in" />;
    } else {
        return <Outlet />;
    }
}   

// const token = cookies.get("TOKEN");
//     if (!token)
//     {
//         //Return to login
//         return <Navigate to="/sign-in" />;
//     }
//     else {
//         //Redirect
//         return <Outlet />;
//     }

export default ProtectedRoutes;

