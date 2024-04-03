import React from "react";
import SearchForm from "../components/SearchForm";
import {SearchFlightsWithProps} from "../components/SearchFlights.js";
import Flight from "../components/Flight.js";
import Gallerry from "../components/Gallery.js";
import FlightShowcase from "../components/FlightsShowcase.js";

// UseContext test
import { useTopAccess } from "../Tests/TopAccessProvider.js";

function Home()
{
    // UseContext test
    const data = useTopAccess();

    const [flights, setFlights] = React.useState([]);
    const [searching, setSearching] = React.useState(false);
    const [hasSearched, setHasSearched] = React.useState(false);

    async function handleSearch(props)
    {
        // Start loading icon (On search button)
        setSearching(true);
        let result;
        // Only send requrests once while loading
        !searching && (result = await SearchFlightsWithProps(props));
        
        if (result.ok)
        {
            setFlights(result.data);
        } else {
            switch (result.errorCode)
            {
                case "F30": {
                    alert("Invalid Origin");
                    return;
                }
                case "F40": {
                    alert("No flights found");
                    return;
                }
                case "U10": {
                    alert("Unknown error");
                    return;
                }
                default:{
                    alert("Unknown error");
                    return;
                }
            }   
        }
        setHasSearched(true);
        // Stop loading icon
        setSearching(false);
    };

    // Place into own file
    const images = [
        {
            original: "../../images/Plane_1.jpg",
            description: "",
        },
        {
            original: "../../images/Holiday_Essencials_1.jpg",
            description: "",

        },
        {
            original: "../../images/Portugal_1.jpg",
            description: "",
        },
        {
            original: "../../images/Suitcase_1.jpg",
            description: "",
        },
        {
            original: "../../images/Houses_1.jpg",
            description: "",
        },
    ];

    const showcase = [
        {
            destination: "Barcelona",
            imageURL: "../../images/Barcelona.jpg",
            price: 20,
        },
        {
            destination: "France",
            imageURL: "../../images/France.jpg",
            price: 80,
        },
        {
            destination: "Miami",
            imageURL: "../../images/Miami.jpg",
            price: 3300,
        },
        {
            destination: "Switzerland",
            imageURL: "../../images/Switzerland.jpg",
            price: 50,
        },
    ]

    return <main>
        <div className="home">
            {/* <img className="home__image" src={image} alt="Plane and skyscraper image"></img> */}
            <div className="home__search">
                <h2 className="align-center">Search Flights</h2>
                <SearchForm             
                    origin=""
                    destination=""
                    from=""
                    to=""
                    return=""
                    maxPrice=""
                    minStay=""
                    maxStay=""
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
                <h2 className="align-center">Find the holiday of your dreams</h2>
                <div className="gallery">
                    <Gallerry images={images} />
                </div>
            </div>

            {/* Add sliding cards */}
            {/* https://www.google.com/search?client=opera-gx&q=html+sliding+cards&sourceid=opera&ie=UTF-8&oe=UTF-8 */}

            <div className="home__showcase">
                <h2 className="align-center">Popular Destinations</h2>
                <div className="destinations">
                    {showcase.map((item, index) => {
                        return <FlightShowcase key={index} item={item}/>;
                    })}
                </div> 
            </div>
        </div>
    </main>
}

export default Home;