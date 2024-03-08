import React from "react";
import { useState } from "react"

function Search(props) {

    const [data, setData] = useState({
        origin: "",
        destination: "",
        from: "",
        to: "",
        return: "",
        maxPrice: "",
        minStay: "",
        maxStay: "",
        outputLimit: props.outputLimit
    });

    // const [data, setData] = useState({
    //     origin: props.origin,
    //     destination: props.destination,
    //     from: props.from,
    //     to: props.to,
    //     return: props.return,
    //     maxPrice: props.maxPrice,
    //     minStay: props.minStay,
    //     maxStay: props.maxStay,
    //     outputLimit: props.outputLimit
    // });

    React.useEffect(() => {
        UpdateData("origin", props.origin || "");
        UpdateData("destination", props.destination || "");
        UpdateData("from", props.from || "");
        UpdateData("to", props.to || "");
        UpdateData("return", props.return || "");
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

    React.useEffect(() => {
    },[])

    return <form className="search" onSubmit={(e) => (submitSearch(e))}>
        <div>
            <h2>Search Flights</h2>
            <div className="search__inputs">
                <input onChange={updateSearch} type="text" name="origin" placeholder="Origin" value={data.origin} required></input>
                <input onChange={updateSearch} type="text" name="destination" placeholder="Destination" value={data.destination} required></input>
                <div className="search__form">
                    <label htmlFor="from">From</label>
                    <input onChange={updateSearch} type="date" name="from" id="from" placeholder="From" value={data.from} required></input>
                </div>
                <div className="search__form">
                    <label htmlFor="to">To</label>
                    <input onChange={updateSearch} type="date" name="to" id="to" placeholder="To" value={data.to}></input>
                </div>
                <select onChange={updateSearch} type="text" name="return" placeholder="Return" value={data.return}>
                    <option value="return">Return</option>
                    <option value="oneway">One-way</option>
                </select>
                <input onChange={updateSearch} type="text" name="maxPrice" placeholder="Max price" value={data.maxPrice} required></input>
                <input onChange={updateSearch} type="text" name="minStay" placeholder="Min Stay" value={data.minStay}></input>
                <input onChange={updateSearch} type="text" name="maxStay" placeholder="Max Stay" value={data.maxStay}></input>
            </div>
        </div>

        <button className="button" type="submit">{props.isSearching ?<div className="loader_slot"><div className="loader"></div></div> : "Search"}</button>
    </form>;
}

export default Search;