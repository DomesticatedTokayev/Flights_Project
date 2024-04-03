import React from "react";
import { useAuth } from "../hooks/AuthProvider";

function HeaderLinks()
{
   // const token = cookie.get("TOKEN");
   const auth = useAuth();

   function LogOut() {
       //  Destroy the cookie
       auth.removeToken();
       //cookie.remove("TOKEN", { path: "/" })
       //  Redirect user to home page
       window.location.href = "/";
   }

    return <section className="header__navigation">
        <a href="/">Home</a>
        <a href="/saved/flights">Saved Flights</a>
        <a href="/account">Account</a>
        {!auth.token && <a href="/sign-up">Sign-up</a>}
        {auth.token ? <a onClick={() => LogOut()}>Log-out</a> : <a href="/log-in">Log-in</a>}
    </section>;
    
}

export default HeaderLinks;