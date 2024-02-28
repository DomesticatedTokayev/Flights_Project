import React from "react";
import Search from "../components/SearchForm";
import getFlight from "../hooks/GetFlights";
import Flight from "../components/Flight.js";

function Home()
{
    let [flights, setFlights] = React.useState([]);

    async function handleSearch(props)
    {
        //Show loading widget
        
        const data = await getFlight(props);
        setFlights(data.data);
        console.log(flights);
        
        //Remove loading widget
    }


    return <main>
        <div className="home">
    
            <div className="home__gallery">

            </div>
             <div className="home__search">
                <Search onSearch={handleSearch} outputLimit={10} />
            </div>
            <div className="home__destinations">        
                {flights && flights.map((item, index) => {
                    return <Flight
                        key={index}
                        originCountry={item.originCountry}
                        destinationCountry={item.destinationCountry}
                        originCity={item.originCity}
                        destinationCity={item.destinationCity}
                        nights={item.nights}
                        return={item.return} 
                        price={item.price}
                        link={item.link}
                        />
                })}
                {/* <Flight destName={"Spain"} nights={8} />
                <Flight destName={"Spain"}/>
                <Flight destName={"Spain"}/>
                <Flight destName={"Spain"}/>
                <Flight destName={"Spain"}/>
                <Flight destName={"Spain"}/> */}
          
            </div>
           
            <div className="home__examples">

            </div>
        </div>
    </main>
}

export default Home;