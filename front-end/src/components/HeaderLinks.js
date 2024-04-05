import React from "react";
import { useAuth } from "../hooks/AuthProvider";

function HeaderLinks()
{
   // const token = cookie.get("TOKEN");
   const auth = useAuth();

   function logOut() {
       //  Destroy the cookie
       auth.removeToken();
       //cookie.remove("TOKEN", { path: "/" })
       //  Redirect user to home page
       window.location.href = "/";
    }
    
    function logIn() {
        window.location.href = "/log-in";
    }

    return <section className="header__navigation">
        <a href="/">Home</a>
        <a href="/saved/flights">Saved Flights</a>
        <a href="/account">Account</a>
        {!auth.token && <a href="/sign-up">Sign-up</a>}
        {auth.token ? <button className="button-link" onClick={() => logOut()}>Log-out</button> : <button className="button-link" onClick={()=>logIn()}>Log-in</button>}
    </section>;
    
}

export default HeaderLinks;