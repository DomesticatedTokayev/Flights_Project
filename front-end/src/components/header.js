import React from "react";
//import Cookies from "universal-cookie";
//const cookie = new Cookies();
import { useAuth } from "../hooks/AuthProvider";


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

    // Use link as button
    //https://www.w3schools.com/howto/howto_js_sidenav.asp

    return <header>
        <div className="header">
            <h1>This is a Header</h1>

            {/* Place the links in a function, and have seperate elements for desktop and mobile screens */}
            {/* Then hide and unhide as required */}
            <section className="header__navigation">
                <div className="hidden">
                    <button>X</button>
                </div>
                <a href="/">Home</a>
                <a href="/free">Free</a>
                <a href="/auth">Auth</a>
                {auth.token ? <a href="javascript:void(0)" onClick={()=>LogOut()}>Log-out</a> : <a href="/sign-in">Sign-In</a>}
            </section>
            {/* <div className="sidemenu"> */}

            {/* </div> */}
        </div>

        
    </header>
}

export default Header;

//<a href="/log-out">Log-out</a>