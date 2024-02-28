import React from "react";

function Flight(props)
{
    function processDate() {
        
    }


    return <div className="flight">
        <div className="flight__dates">
            {props.return ?
                <>
                    <div className="date text-gap">
                        <p>11/04/2024</p>
                        <p>-</p>
                        <p>23/04/2024</p>
                    </div>
                    <div className="nights text-gap">
                        <p className="grey-text">{props.nights ? props.nights : 10}</p>
                        <p className="grey-text">nights</p>
                    </div>
                </>
                :
                    <p className="one-way_date align-center">11/04/2024</p>
            }   
        </div>
        <div className="flight__info">
            <div className="flight__dest">
                <div className="countries ">
                    <div>
                        <p className="country grey-text">{props.originCountry ? props.originCountry : "Origin"}</p>
                        <p className="city">{props.originCity ? props.originCity : "Origin"}</p>
                        <p className="time grey-text">08:30</p>
                    </div>
                    <span className="arrow material-symbols-outlined grey-text">east</span>
                    <div>
                    <p className="country grey-text">{props.destinationCountry ? props.destinationCountry : "Origin"}</p>
                        <p className="city">{props.destinationCity ? props.destinationCity : "Destination"}</p>
                        <p className="time grey-text">08:30</p>
                    </div>
                </div>
                {props.return && <>
                    <div>
                    <hr className="line-break"></hr>
                </div>
                <div className="countries text-gap">
                    <div>
                    <p className="country grey-text">{props.destinationCountry ? props.destinationCountry : "Origin"}</p>
                        <p className="city">{props.destinationCity ? props.destinationCity : "Origin"}</p>
                        <p className="time grey-text">08:30</p>
                    </div>
                    <span className="arrow material-symbols-outlined grey-text">east</span>
                    <div>
                    <p className="country grey-text">{props.originCountry ? props.originCountry : "Origin"}</p>
                        <p className="city">{props.originCity ? props.originCity : "Destination"}</p>
                        <p className="time grey-text">08:30</p>
                    </div>
                </div>
                </>}
                
            </div>
            <div className="flight__cost">
                <p>£</p>
                <p>{props.price ? props.price : "000"}</p>
            </div>
        </div>
        <div className="flight__buttons text-gap">
            <a href={props.link} target="_blank" rel="noreferrer noopener"><button className="button">View Flight</button></a>
            <a><button className="button">Save Destination</button></a>
        </div>
    </div>
}

export default Flight;