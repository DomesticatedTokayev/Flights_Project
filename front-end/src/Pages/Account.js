import React from "react";
import { useAuth } from "../hooks/AuthProvider";
import {useNavigate} from "react-router-dom";

function Account()
{
    const auth = useAuth();
    const navigate = useNavigate();

    function navigateToAccountDetails() {
        navigate("/account/details");
    };

    return <main>
        <div className="account">
            <h2>My Account</h2>
            <p className="account_name grey-text">{auth.user ? auth.user : "User Name"}</p>
            <div className="account__links">
                {/* Use buttons instead of links (Also use navigate instead href: To return back without errors) */}
                <button className="button-link" onClick={navigateToAccountDetails}>Account Details</button>
                {/* <a href="###">Subscription</a>
                <a href="###">Payment Details</a>
                <a href="###">Help</a> */}
            </div>
        </div>
    </main>
}

export default Account;

// href="/accountDetails"