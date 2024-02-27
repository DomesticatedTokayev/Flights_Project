import React from "react";
import Search from "../components/SearchForm";
import getFlight from "../hooks/GetFlights";
import Flight from "../components/Flight.js";

function Home()
{
    let [flights, setFlights] = React.useState([]);

    async function handleSearch(props)
    {
        const data = await getFlight(props);
        setFlights(data.data);
        console.log(flights);
    }



    return <main>
        <div className="home">
    
            <div className="home__gallery">

            </div>
             <div className="home__search">
                <Search onSearch={handleSearch} outputLimit={10} />
            </div>
            <div className="home__destinations">        
                {/* {flights && flights.map((item, index) => {
                    return <Flight key={index} destName={item.destinationCountry} />
                })} */}
                <Flight destName={"Spain"}/>
                <Flight destName={"Spain"}/>
                <Flight destName={"Spain"}/>
          
            </div>
           
            <div className="home__examples">

            </div>
        </div>
    </main>
}

export default Home;