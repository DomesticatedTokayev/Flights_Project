import React from "react";
import Search from "../components/SearchForm";
import getFlight from "../hooks/GetFlights";

function Home()
{
    function handleSearch(props)
    {
        getFlight(props);
    }


    return <main>
        <div className="home">
    
            <div className="home__gallery">

            </div>
             <div className="home__search">
                <Search onSearch={handleSearch} />
            </div>
            <div className="home__destinations">

            </div>
           
            <div className="home__examples">

            </div>
        </div>
    </main>
}

export default Home;