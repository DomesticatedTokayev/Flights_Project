import React from "react";
import HeaderLinks from "./HeaderLinks";
import UseOutsideClick from "./UseOutsideClick";
//import Cookies from "universal-cookie";
//const cookie = new Cookies();

function Header()
{
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
                <button className="button-link" onClick={()=>toggleSideMenu("none")}><span className="material-symbols-outlined">close</span></button>
                <HeaderLinks/>
            </div>

            <div className="header__landscape">
                <HeaderLinks/>
            </div>

            <div className="open_sidemenu">
                <button className="button-link" onClick={()=>toggleSideMenu("block")}><span className="material-symbols-outlined">menu</span></button>
            </div>
        </div>
    </header>
}

export default Header;