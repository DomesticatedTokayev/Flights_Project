import axios from "axios";
import { error } from "console";
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
                return {error: "Location not found"};
            }
            })
            .catch(error => {
                throw new Error(error);
            })
        
    return flightCode;
}

export async function searchFlight(flyFrom, flyTo, dateFrom, dateTo, currency = "GBP", maxPrice, minNights, maxNights, withReturn, returnOneCheapestFlight = 0, maxStoppovers = 0, limit = 10)
{
    // let originIATA
    // let destinationIATA

    // try {
    //     originIATA = await searchLocation(flyFrom);
    //     // console.log(originIATA, destinationIATA);
    // } catch (error){
    //     //console.log(error.message);
    //     throw new Error(error);
    // }
    
    // try {
    //     destinationIATA = await searchLocation(flyTo);
    //     // console.log(originIATA, destinationIATA);
    // } catch (error){
    //     //console.log(error.message);
    //     throw new Error(error);
    // }

 

    // Set URL and config
    const searchURL_WithReturn = url.format({
        pathname: SEARCH_API,
        query: {
            fly_from: flyFrom,
            fly_to: flyTo,
            date_from: dateFrom, //"01/04/2024"
          
            curr: currency,
            price_to: maxPrice,

            // Returns single cheapest flight
            one_for_city: returnOneCheapestFlight,

            date_to: dateTo, //"03/05/2024"
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
            fly_to: flyTo,
            date_from: dateFrom, //"01/04/2024"
          

            curr: currency,
            price_to: maxPrice,

            // Returns single cheapest flight
            one_for_city: returnOneCheapestFlight,

            //date_to: dateTo, //"03/05/2024"
            //nights_in_dst_from: minNights,
            //nights_in_dst_to: maxNights,

            ret_from_diff_city: false,
            ret_to_diff_city: false,
            
            max_stopovers: maxStoppovers,
            limit: limit

        }
    });

    let searchURL = withReturn === "return" ? searchURL_WithReturn :  searchURL_OneWay
    let flightData = [];

    await axios.get(searchURL, config)
    .then((result) => {
        //console.log(result.data.data);

        let numOfFlights = result.data.data.length;

        for (let i = 0; i < numOfFlights; i++)
        {
            // let time = new Date(result.data.data[i].route[0].local_departure);
            // console.log(`local Departire: ${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padEnd(2, '0')}`);

            // time = new Date(result.data.data[i].route[0].local_arrival);
            // console.log(`local Arrival: ${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padEnd(2, '0')}`);

            // let date = new Date(result.data.data[i].route[0].local_departure);
            // console.log(`Departure Date: ${ date.getDate().toString().padEnd(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`);
            
            // date = new Date(result.data.data[i].route[0].local_arrival);
            // console.log(`Arrival Date: ${date.getDate().toString().padEnd(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`);

            let flight = {
                originCountry: result.data.data[i].countryFrom.name,
                originCity: result.data.data[i].route[0].cityFrom,
                originAirport: result.data.data[i].route[0].flyFrom,

                destinationCountry: result.data.data[i].countryTo.name,
                destinationCity: result.data.data[i].route[0].cityTo,
                destinationAirport: result.data.data[i].route[0].flyTo,

                localDeparture: result.data.data[i].route[0].local_departure,
                localArrival: result.data.data[i].route[0].local_arrival,
                
                
                price: result.data.data[i].price,
                link: result.data.data[i].deep_link,
            };

            if (withReturn === "return")
            {
               // console.log(result.data.data[i]);
                flight.returnLocalDepartire = result.data.data[i].route[1].utc_departure;
                flight.returnLocalArrival = result.data.data[i].route[1].utc_arrival;
                flight.return = true;
                flight.nights = result.data.data[i].nightsInDest;
            }

            flightData.push(flight);

            // Warning! -----------------------------------------------------------------------
            // Returning from '.then' always returns undefined
        }
    })
    .catch((error) => {
        //console.log(error.response.data.error);
        console.log(error);
        throw new Error(error);
        //throw new Error(error.response.data.error);
    })

    return flightData;
}