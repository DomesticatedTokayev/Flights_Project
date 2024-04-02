import React from "react";

function FlightShowcase(item) {
    return <div className="showcase">
        {/* Country Name */}
        <h4 className="showcase__header">{item.item.destination}</h4>
        {/* Country Image */}
        <img className="showcase__img" src={item.item.imageURL} alt={item.alt}></img>
        {/* Price */}
        <p className="showcase_price">From £{item.item.price}</p>
    </div>
};

export default FlightShowcase;