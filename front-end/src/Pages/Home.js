import React from "react";
import Search from "../components/SearchForm";
import getFlight from "../hooks/GetFlights";
import Flight from "../components/Flight.js";

import image from "../images/Skyscraper.jpg";

function Home()
{
    const [flights, setFlights] = React.useState([]);
    const [searching, setSearching] = React.useState(false);
    const [hasSearched, setHasSearched] = React.useState(false);

    // Put this function into a seperate file (Make it usable else ware)
    async function handleSearch(props)
    {
        // Start loading icon (On search button)
        setSearching(true);

        let data;
        // Only send requrests once while loading
        !searching && (data = await getFlight(props));

        setFlights(data);

        setHasSearched(true);
  
        // Stop loading icon
        setSearching(false);
    }


    return <main>
        <div className="home">
            <img className="home__image" src={image} alt="Plane and skyscraper image"></img>
            <div className="home__search">
                <Search onSearch={handleSearch} outputLimit={10} isSearching={searching} />
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