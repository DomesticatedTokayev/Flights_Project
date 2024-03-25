import axios from "axios";

export default async function SearchFlights(props) {
    const query = {
        origin: props.origin,
        destination: props.destination,
        from: props.from,
        to: props.to,
        return: props.return,
        max_price: props.maxPrice,
        min_stay: props.minStay,
        max_stay: props.maxStay,
        output_limit: props.outputLimit,
    };

    const configuration = {
        method: "get",
        url: "http://localhost:3000/search/flights",
        params: query,
    }

    let data = "";

    await axios(configuration)
        .then(result => {
            data = result.data;
        }).catch(error => {
            console.log(error);
        })

    return data;
    // Return an object, with data and error is required
}
