import React from "react";
import DetailsEntry from "../components/DetailsEntry"

function AccountDetails()
{
    return <main>
        <div className="account_details">
            <h2>This is Account Details</h2>
            <div>
                <DetailsEntry />
                <DetailsEntry />
                <DetailsEntry />
            </div>
        </div>
    </main>
}

export default AccountDetails;