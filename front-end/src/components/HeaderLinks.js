import React from "react";
import { useAuth } from "../hooks/AuthProvider";

function HeaderLinks()
{
   // const token = cookie.get("TOKEN");
   const auth = useAuth();

   console.log(auth.token);

   function LogOut() {
       //  Destroy the cookie
       auth.removeToken();
       //cookie.remove("TOKEN", { path: "/" })
       //  Redirect user to home page
       window.location.href = "/";
   }

    return <section className="header__navigation">
        <a href="/">Home</a>
        <a href="/free">Free</a>
        <a href="/auth">Auth</a>
        <a href="/custom">Custom Flights</a>
        <a href="/account">Account</a>
        {auth.token ? <a onClick={() => LogOut()}>Log-out</a> : <a href="/sign-in">Sign-In</a>}
    </section>;
    
}

export default HeaderLinks;