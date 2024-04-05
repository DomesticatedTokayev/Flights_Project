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

    // Put this into its own script (Share with custom flights search)
    function toggleSideMenu(setting)
    {
        const sideMenu = document.getElementById("sideBar");
        sideMenu.style.display = setting;
    }

    function closeSideMenu() {
        toggleSideMenu("none");
    }

    const ref = UseOutsideClick(closeSideMenu);

    const handleHeaderClick = (event) => {
        event.stopPropagation();
    }

    function returnHome() {
        window.location.href = "/";
    }

    return <header >
        <div className="header">
        <h1 onClick={returnHome}>Flights Finder</h1>
            <div ref={ref} className="sidebar" id="sideBar" onClick={handleHeaderClick}>
                <button className="button-link" onClick={()=>toggleSideMenu("none")}><span class="material-symbols-outlined">close</span></button>
                <HeaderLinks/>
            </div>

            <div className="header__landscape">
                <HeaderLinks/>
            </div>

            <div className="open_sidemenu">
                <button className="button-link" onClick={()=>toggleSideMenu("block")}><span class="material-symbols-outlined">menu</span></button>
            </div>
        </div>
    </header>
}

export default Header;