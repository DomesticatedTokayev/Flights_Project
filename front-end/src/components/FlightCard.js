import React from "react";
///
// Disable save button when in custom flights

function FlightCard(props)
{
    const [id, setID] = React.useState(undefined);


    React.useEffect(() => {
        setID(props.id);

        
    }, []);


    function handleDelete() {
        // Send flight data (So additional api calls are not required)

        props.handleDelete(props.id);
    }


    function handleSearch() {
        //Send flight data
        props.handleSearch(
            props.originCity ? props.originCity : props.originCountry,
            props.destinationCity ? props.destinationCity : props.destinationCountry,
            props.from,
            props.to,
            props.maxPrice,
            props.return,
            props.minStay,
            props.maxStay
        );
    }

    function handleEdit() {
        // Open edit flight
        props.handleEdit(
            id,
            props.originCity ? props.originCity : props.originCountry,
            props.destinationCity ? props.destinationCity : props.destinationCountry,
            props.from,
            props.to,
            props.maxPrice,
            props.return,
            props.minStay,
            props.maxStay
        );
    }

    function handleAddFlight() {
        props.handleAddFlight(
            props.originCity,
            props.originCountry,
            props.destinationCity,
            props.destinationCountry,
            props.from,
            props.to,
            props.maxPrice,
            props.return,
            props.minStay,
            props.maxStay
        );
    }

    return <div className="card">
        <div className="col card__directions">
            <div className="destinations">
                <div className="countries">
                    <div>
                        {props.originCity && <p className="city grey-text">{props.originCity}</p>}
                        <p className="country ">{props.originCountry ? props.originCountry : "Origin"}</p>
                    </div>
                    <span className="arrow material-symbols-outlined grey-text">east</span>
                    <div>
                        {props.destinationCity &&  <p className="city grey-text">{props.destinationCity}</p>}   
                        <p className="country ">{props.destinationCountry ? props.destinationCountry : "Origin"}</p>
                    </div>
                </div>
                {props.return && <>
                    <div className="break">
                        <hr className="line-break"></hr>
                    </div>
                <div className="countries text-gap">
                        <div>
                        {props.destinationCity && <p className="city grey-text">{props.destinationCity}</p>}
                        <p className="country ">{props.destinationCountry ? props.destinationCountry : "Origin"}</p>
                    </div>
                    <span className="arrow material-symbols-outlined grey-text">east</span>
                        <div>
                        {props.originCity && <p className="city grey-text">{props.originCity}</p>}
                        <p className="country ">{props.originCountry ? props.originCountry : "Origin"}</p>
                    </div>
                </div>
                </>}
                
            </div>
        </div>
        <div className="col card__dates">
            <div className="date_time">
                <div className="gap">
                    <div className="dates">
                        <p><span className="grey-text">From: </span>{props.from}</p>
                        <p></p>
                        <p><span className="grey-text">To:</span> {props.to}</p>
                    </div>
                    {props.return && <>
                        <div className="times">
                        <p><span className="grey-text">Min-nights:</span> {props.minStay}</p>
                        <p><span className="grey-text">Max-nights:</span> {props.maxStay}</p>
                    </div>
                    </>}
                   
                </div>
            </div>
        </div>
        <div className="col card__price">
            <div>
                <p className="grey-text">Max Price</p>
                <div className="price">
                <p>£</p>
                <p>{props.maxPrice}</p>
                </div>
            </div>
        </div>
        {/* Determin if user is in edit or new flight: Set titles to appropriate names */}
        <div className="col card__options">
            {props.isAddFlight ? 
                <button className="button full_width" onClick={handleAddFlight}>Add</button> :
                <>
                    <button className="button" onClick={handleEdit}>Edit</button>
                    <button className="button" onClick={handleSearch}>Search</button>
                    <button className="button" onClick={handleDelete}>Delete</button>
                </>
            }
            </div>
    
    </div>
}

export default FlightCard;