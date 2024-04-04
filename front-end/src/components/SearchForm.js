import React from "react";
import { useState } from "react"

function Search(props) {

    const [withReturn, setWithReturn] = React.useState(true);

    const [data, setData] = useState({
        origin: "",
        destination: "",
        from: "",
        to: "",
        return: "oneway",
        maxPrice: "",
        minStay: "",
        maxStay: "",
        outputLimit: props.outputLimit
    });


    React.useEffect(() => {
        UpdateData("origin", props.origin || "");
        UpdateData("destination", props.destination || "");
        UpdateData("from", props.from || "");
        UpdateData("to", props.to || "");
        UpdateData("return", props.return || "oneway" ); // || "return"
        UpdateData("maxPrice", props.maxPrice || "");
        UpdateData("minStay", props.minStay || "");
        UpdateData("maxStay", props.maxStay || "");
        UpdateData("outputLimit", props.outputLimit || "");
        
    }, []);

    function UpdateData(name, value) {
        setData(prevValue => ({ ...prevValue, [name]: value }));
    }

    function updateSearch(event)
    {
        const { name, value } = event.target;
        setData(prevValue => ({ ...prevValue, [name]: value }));
        
    }

    function submitSearch(event)
    {
        event.preventDefault();
        props.onSearch(data);
    }

    return <form className="search" onSubmit={(e) => (submitSearch(e))}>
        <div>
            <div className="search__inputs">
                <div>
                    <label htmlFor="origin">Origin</label>
                    <input onChange={updateSearch} type="text" name="origin" id="origin" placeholder="Origin" value={data.origin} required></input>
                </div>
                <div>
                    <label htmlFor="destination">Destination</label>
                    <input onChange={updateSearch} type="text" name="destination" id="destination" placeholder="Any" value={data.destination}></input>
                </div>
                <div>
                    <label htmlFor="from">From</label>
                    <input onChange={updateSearch} type="date" name="from" id="from" placeholder="From" value={data.from} required></input>
                </div>
                <div>
                    <label htmlFor="to">To</label>
                    <input onChange={updateSearch} type="date" name="to" id="to" placeholder="To" value={data.to} required></input>
                </div>
                <div>
                    <label htmlFor="return">Return</label>
                    <select onChange={updateSearch} type="text" name="return" id="return" placeholder="Return" value={data.return}>
                        <option value="return">Return</option>
                        <option value="oneway">One-way</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="maxPrice">Max Price</label>
                    <input onChange={updateSearch} type="number" name="maxPrice" id="maxPrice" placeholder="Any" value={data.maxPrice} min="0" ></input>
                </div>  
                <div>
                    <label htmlFor="minStay">Min Stay</label>
                    <input onChange={updateSearch} type="number" name="minStay" id="minStay" placeholder="" value={data.minStay} required disabled={data.return === "oneway" ? true : false}></input>
                </div>
                <div>
                    <label htmlFor="maxStay">Max Stay</label>
                    <input onChange={updateSearch} type="number" name="maxStay" id="maxStay" placeholder="" value={data.maxStay} required disabled={data.return === "oneway" ? true : false}></input>
                </div>
            </div>
        </div>
        <button className="button" type="submit">{props.isSearching ?<div className="loader_slot"><div className="loader"></div></div> : "Search"}</button>

    </form>;
}

export default Search;