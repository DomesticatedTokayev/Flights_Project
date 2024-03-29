import axios from "axios";
import url from "url";

const TEQUILA_API = "3T6eGI3mD8RdWEX_0-cmOWdyqldErA1l";

const LOCATION_API = "https://api.tequila.kiwi.com/locations/query";
const SEARCH_API = "https://api.tequila.kiwi.com/v2/search";

const config = {
    headers: {
        //Content-Type: 'application/json',
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
            term: city,
        }
    });

    let flightCode = "";
    
    await axios.get(searchURL, config)
        .then((result) => { 
            if (!(result.data.locations[0] === null || result.data.locations[0] === undefined))
            {
                flightCode = result.data.locations[0]["code"];
             
            } else
            {
                //return { error: "Location not found" };
                throw("Location not found");
            }
            })
            .catch(error => {
                throw(error);
            })
        
    return flightCode;
}

export async function searchFlight(flyFrom, flyTo, dateFrom, dateTo, currency = "GBP", maxPrice, minNights, maxNights, withReturn, returnOneCheapestFlight = 0, maxStoppovers = 0, limit = 10)
{
    // If 'date from' and/or 'date to' is null, check flight from today and leave date to empty

    const searchURL_WithReturn = url.format({
        pathname: SEARCH_API,
        query: {
            fly_from: flyFrom,
            fly_to: flyTo,
            date_from: dateFrom,
          
            curr: currency,
            price_to: maxPrice ,

            one_for_city: returnOneCheapestFlight,

            date_to: dateTo,
            nights_in_dst_from: minNights,
            nights_in_dst_to: maxNights,

            ret_from_diff_city: false,
            ret_to_diff_city: false,
            
            max_stopovers: maxStoppovers,
            limit: limit

        }
    });

    const searchURL_OneWay = url.format({
        pathname: SEARCH_API,
        query: {
            fly_from: flyFrom,
            date_from: dateFrom,
            fly_to: flyTo,

            curr: currency,
            price_to: maxPrice,

            one_for_city: returnOneCheapestFlight,

            ret_from_diff_city: false,
            ret_to_diff_city: false,
            
            max_stopovers: maxStoppovers,
            limit: limit

        }
    });
    let searchURL = withReturn === "return" ? searchURL_WithReturn : searchURL_OneWay

    let flightData = [];

    await axios.get(searchURL, config)
        .then((result) => {
            let numOfFlights = result.data.data.length;

            for (let i = 0; i < numOfFlights; i++) {

            let flight = {
                originCountry: result.data.data[i].countryFrom.name,
                originCity: result.data.data[i].route[0].cityFrom,
                originAirport: result.data.data[i].route[0].flyFrom,
                destinationCountry: result.data.data[i].countryTo.name,
                destinationCity: result.data.data[i].route[0].cityTo,
                destinationAirport: result.data.data[i].route[0].flyTo,

                utcDeparture: result.data.data[i].route[0].utc_departure,
                utcArrival: result.data.data[i].route[0].utc_arrival,
                
                return: false,
                
                price: result.data.data[i].price,
                link: result.data.data[i].deep_link,
            };

            // Add additional parameters if flight is with return
            if (withReturn === "return")
            {
               // console.log(result.data.data[i]);
                flight.returnUtcDeparture = result.data.data[i].route[1].utc_departure;
                flight.returnUtcArrival = result.data.data[i].route[1].utc_arrival;
                flight.return = true;
                flight.nights = result.data.data[i].nightsInDest;
            }

            flightData.push(flight);

            // Warning! -----------------------------------------------------------------------
            // Returning from '.then' always returns undefined
        }
    })
    .catch((error) => {

        throw(error);
    })

    return flightData;
}