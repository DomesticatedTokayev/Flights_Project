import React from "react";
import { useAuth } from "../hooks/AuthProvider";

function Account()
{
    const auth = useAuth();

    return <main>
        <div className="account">
            <h2>My Account</h2>
            <p className="account_name grey-text">{auth.user ? auth.user : "User Name"}</p>
            <div className="account__links">
                <a href="/accountDetails">Account Details</a>
                <a href="###">Subscription</a>
                <a href="###">Payment Details</a>
                <a href="###">Help</a>
            </div>
        </div>
    </main>
}

export default Account;