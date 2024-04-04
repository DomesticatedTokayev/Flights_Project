import React from "react";

function Footer()
{

    const year = new Date().getFullYear();

    return <footer className="footer">
        <h4 className="copyright">Copyright {year}</h4>
    </footer>
}

export default Footer;