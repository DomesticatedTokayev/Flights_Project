import React from "react";

function Flight(props)
{
    return <div className="flight">
        <div>Date - Date</div>
        <div className="flight__info">
            <div className="flight__dest">
                <div>Flight To</div>
                <div>Flight From</div>
            </div>
            <div className="flight__cost">£30</div>
        </div>
        <div>View or Save</div>
    </div>
}

export default Flight;