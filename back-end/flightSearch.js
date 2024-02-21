import axios from "axios";
import { error } from "console";
import url from "url";

const TEQUILA_API = "3T6eGI3mD8RdWEX_0-cmOWdyqldErA1l";

const LOCATION_API = "https://api.tequila.kiwi.com/locations/query";
const SEARCH_API = "https://api.tequila.kiwi.com/v2/search";

const config = {
    headers: {
        accept: 'application/json',
        apikey:  TEQUILA_API,
    }
};

export async function searchLocation(city)
{
    // Set URL
    const searchURL = url.format({
        pathname: LOCATION_API,
        query: {
            term: "London",
        }
    });

    // Use axios to send GET request to search API
    try {
        const result = await axios.get(searchURL, config);
        var code = result.data.locations[0].code;
    } catch (error) {
        console.log(error);  
    }

    // If successful, return IATI code,
    // else return error
    return code !== "" ? code : null;
}

export async function searchFlight(flyFrom, flyTo, dateFrom, dateTo, currency = "GBP", maxPrice, minNights, maxNights, returnOneCheapestFlight = 0, maxStoppovers = 0)
{
    // Set URL and config
    const searchURL = url.format({
        pathname: SEARCH_API,
        query: {
            fly_from: flyFrom,
            fly_to: flyTo,
            date_from: dateFrom, //"01/04/2024"
            date_to: dateTo, //"03/05/2024"

            curr: currency,
            price_to: maxPrice,

            // Returns single cheapest flight
            one_for_city: returnOneCheapestFlight,

            nights_in_dst_from: minNights,
            nights_in_dst_to: maxNights,

            ret_from_diff_city: false,
            ret_to_diff_city: false,
            
            max_stopovers: maxStoppovers,
            limit: 10

        }
    });

  

    // try {

        await axios.get(searchURL, config)
        .then((result) => {
            console.log(result.data);
    
        })
        .catch((error) => {
             console.log("Error: ", error.response.data.error);
        })
    
        
    // } catch (error)
    // {
    //     console.log("Error:", error);
    // }
}