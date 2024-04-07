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
            <p className="account_name grey-text text-overflow">{auth.user ? auth.user : "User Name"}</p>
            <div className="account__links">
                <button className="button-link" onClick={navigateToAccountDetails}>Account Details</button>
                <button className="button-link disabled" onClick={null}>Subscription</button>
                <button className="button-link disabled" onClick={null}>Help</button>
                <button className="button-link disabled" onClick={null}>Contact Us</button>
            </div>
        </div>
    </main>
}

export default Account;

// href="/accountDetails"