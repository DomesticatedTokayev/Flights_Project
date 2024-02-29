import React from "react";

function FlightCard(props)
{
    return <div className="card">
        <div className="card__directions"> </div>
        <div className="card__dates"><p>Date and Nights</p></div>
        <div className="card__price"><p>Price</p></div>
        <div className="card__options"><p>Options</p></div>
    </div>
}

export default FlightCard;