import React from "react";
import SearchForm from "../components/SearchForm";
import SearchFlights from "../components/SearchFlights.js";
import Flight from "../components/Flight.js";

import image from "../images/Skyscraper.jpg";

// UseContext test
import { useTopAccess } from "../Tests/TopAccessProvider.js";

function Home()
{
    // UseContext test
    const data = useTopAccess();
    //data.PrintAlert("YEs");

    const [flights, setFlights] = React.useState([]);
    const [searching, setSearching] = React.useState(false);
    const [hasSearched, setHasSearched] = React.useState(false);

    async function handleSearch(props)
    {
        // Start loading icon (On search button)
        setSearching(true);
        let data;
        // Only send requrests once while loading
        !searching && (data = await SearchFlights(props));
        setFlights(data);
        setHasSearched(true);
        // Stop loading icon
        setSearching(false);
    };



    return <main>
        <div className="home">
            <img className="home__image" src={image} alt="Plane and skyscraper image"></img>
            <div className="home__search">
                <SearchForm             
                    origin="London"
                    destination="Spain"
                    from="2024-03-20"
                    to="2024-05-20"
                    return="return"
                    maxPrice="300"
                    minStay="3"
                    maxStay="14"
                    outputLimit={10}
                    onSearch={handleSearch}   
                    isSearching={searching} 
                    />
            </div>
            <div className={flights.length > 1 ? "home__destinations grid_layout" : "home__destinations block_layout"}>
                {(hasSearched === true && flights.length <= 0) && <h3 className="align-center">No flights found!</h3>}
                {flights && flights.map((item, index) => {
                    return <Flight
                        key={index}
                        originCountry={item.originCountry}
                        destinationCountry={item.destinationCountry}
                        originCity={item.originCity}
                        destinationCity={item.destinationCity}
                        utcDeparture={item.utcDeparture}
                        utcArrival={item.utcArrival}
                        returnUtcDeparture={item.returnUtcDeparture}
                        returnUtcArrival={item.returnUtcArrival}
                        nights={item.nights}
                        return={item.return} 
                        price={item.price}
                        link={item.link}
                        />
                })}          
            </div>
            <div className="home__gallery">

            </div>
            {/* <div className="home__examples">
            </div> */}
        </div>
    </main>
}

export default Home;