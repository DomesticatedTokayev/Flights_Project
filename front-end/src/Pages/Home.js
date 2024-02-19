import React from "react";

function Home()
{
    return <main>
        <div className="home">
    
            <div className="home__gallery">

            </div>
             {/* Place the form into its own component */}
             <div className="home__search">
                <form className="search">
                <div>
                    <h2>Search Flights</h2>
                    <div className="search__inputs">
                        <input type="text" name="origin" placeholder="Origin" required></input>
                        <input type="text" name="destination" placeholder="Destination" required></input>
                        <div className="search__form">
                            <label htmlFor="from">From</label>
                            <input type="date" name="from" id="from" placeholder="From" required></input>
                        </div>
                        <div className="search__form">
                            <label htmlFor="to">To</label>
                            <input type="date" name="to" id="to" placeholder="To" required></input>
                        </div>
                            <select type="text" name="return" placeholder="Return" required>
                                <option>Return</option>
                                <option>One-way</option>
                        </select>
                        <input type="text" name="max-price" placeholder="Max price" required></input>
                        <input type="text" name="min-stay" placeholder="Min Stay" required></input>
                        <input type="text" name="max-stay" placeholder="Max Stay" required></input>
                    </div>
                </div>
                <button type="submit">Search</button>
                </form>
            </div>
            <div className="home__destinations">

            </div>
           
            <div className="home__examples">

            </div>
        </div>
    </main>
}

export default Home;