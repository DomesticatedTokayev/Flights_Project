import React from "react";
//import Cookies from "universal-cookie";
//const cookie = new Cookies();
import { useAuth } from "./AuthProvider";


function Header()
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

    return <header>
        <h2>This is a Header</h2>

        <section className="navigation">
            <a href="/">Home</a>
            <a href="/free">Free</a>
            <a href="/auth">Auth</a>
            {auth ? <button type="submit" onClick={()=>LogOut()}>Log-out</button> : <a href="/sign-in">Sign-In</a>}
        </section>
    </header>
}

export default Header;

//<a href="/log-out">Log-out</a>