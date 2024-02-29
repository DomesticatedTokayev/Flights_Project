import React from "react";

function FlightDirections(props)
{
    return <>{props.return ?
        <>
            <div className="date text-gap">
                <p>{props.departureDay}/{props.departureMonth}/{props.departureYear}</p>
                <p>-</p>
                <p>{props.returnDepartureDay}/{props.returnDepartureMonth}/{props.returnDepartureYear}</p>
            </div>
            <div className="nights text-gap">
                <p className="grey-text">{props.nights ? props.nights : 10}</p>
                <p className="grey-text">nights</p>
            </div>
        </> :
        <p className="one-way_date align-center">{props.departureDay}/{props.departureMonth}/{props.departureYear}</p>
    }      
        </>
}

export default FlightDirections;