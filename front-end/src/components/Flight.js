import React from "react";
import parseDate from "./DateAndTimeParser";

function Flight(props) {

    // Place this into its own component -----------------------------------------------------------------------
    const { hour: departureHour, minutes: departureMinutes } = parseDate(props.utcDeparture);
    const { hour: arrivalHour, minutes: arrivalMinutes } = parseDate(props.utcArrival);
    const { day: departureDay, month: departureMonth, year: departureYear} = parseDate(props.utcDeparture);

    //Return
    const { hour: returnArrivalHour, minutes: returnArrivalMinutes } = props.return && parseDate(props.returnUtcArrival);
    const { hour: returnDepartureHour, minutes: returnDepartureMinutes } = props.return && parseDate(props.returnUtcDeparture);
    const { day: returnDepartureDay, month: returnDepartureMonth, year: returnDepartureYear } = props.return && parseDate(props.returnUtcDeparture);
        

    return <div className="flight">
        <div className="flight__dates">
         {props.return ?
        <>
            <div className="date text-gap">
                <p>{departureDay}/{departureMonth}/{departureYear}</p>
                <p>-</p>
                <p>{returnDepartureDay}/{returnDepartureMonth}/{returnDepartureYear}</p>
            </div>
            <div className="nights text-gap">
                <p className="grey-text">{props.nights ? props.nights : 10}</p>
                <p className="grey-text">nights</p>
            </div>
        </> :
            <p className="one-way_date align-center">{departureDay}/{departureMonth}/{departureYear}</p>
        }   
        </div>
        <div className="flight__info">
            <div className="destinations">
                <div className="countries">
                    <div>
                        <p className="city grey-text">{props.originCity ? props.originCity : "Origin"}</p>
                        <p className="country ">{props.originCountry ? props.originCountry : "Origin"}</p>
                        <p className="time grey-text">{departureHour}:{departureMinutes}</p>
                    </div>
                    <span className="arrow material-symbols-outlined grey-text">east</span>
                    <div>
                        <p className="city  grey-text">{props.destinationCity ? props.destinationCity : "Destination"}</p>
                        <p className="country">{props.destinationCountry ? props.destinationCountry : "Origin"}</p>
                        <p className="time grey-text">{arrivalHour}:{arrivalMinutes}</p>
                    </div>
                </div>
                {props.return && <>
                    <div className="break">
                    <hr className="line-break"></hr>
                </div>
                <div className="countries text-gap">
                    <div>
                        <p className="city grey-text">{props.destinationCity ? props.destinationCity : "Origin"}</p>
                        <p className="country ">{props.destinationCountry ? props.destinationCountry : "Origin"}</p>
                        <p className="time grey-text">{returnDepartureHour}:{returnDepartureMinutes}</p>
                    </div>
                    <span className="arrow material-symbols-outlined grey-text">east</span>
                    <div>
                        <p className="city grey-text">{props.originCity ? props.originCity : "Destination"}</p>
                        <p className="country ">{props.originCountry ? props.originCountry : "Origin"}</p>
                        <p className="time grey-text">{returnArrivalHour}:{returnArrivalMinutes}</p>
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
            {/* <a><button className="button">Save</button></a> */}
        </div>
    </div>
}

export default Flight;
