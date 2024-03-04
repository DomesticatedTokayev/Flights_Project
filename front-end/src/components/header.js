import React from "react";
import HeaderLinks from "./HeaderLinks";
import UseOutsideClick from "./UseOutsideClick";
//import Cookies from "universal-cookie";
//const cookie = new Cookies();

function Header()
{
    // Use link as button
    // Also has menu sliding
    //https://www.w3schools.com/howto/howto_js_sidenav.asp
    function toggleSideMenu(setting)
    {
        const sideMenu = document.getElementById("sideBar");
        const currentDisplay = sideMenu.style.display = setting;
    }

    function closeSideMenu() {
        toggleSideMenu("none");
    }

    const ref = UseOutsideClick(closeSideMenu);

    const handleHeaderClick = (event) => {
        event.stopPropagation();
    }

    return <header className="header">
        <>
        <h1>This is a Header</h1>
            <div ref={ref} className="header__portrait" id="sideBar" onClick={handleHeaderClick}>
                <button onClick={()=>toggleSideMenu("none")}>X</button>
                <HeaderLinks/>
            </div>

            <div className="header__landscape">
                <HeaderLinks/>
            </div>

            <div className="open_sidemenu">
                <button onClick={()=>toggleSideMenu("block")}>Open</button>
            </div>
        </>
    </header>
}

export default Header;

//<a href="/log-out">Log-out</a>