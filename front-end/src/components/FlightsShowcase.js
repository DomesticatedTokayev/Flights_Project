import React from "react";

function FlightShowcase(item) {
    return <div className="showcase">
        <h3 className="showcase__header title">{item.item.destination}</h3>
        <img className="showcase__img" src={item.item.imageURL} alt={item.alt}></img>
        <h3 className="showcase_price title">From £{item.item.price}</h3>
    </div>
};

export default FlightShowcase;