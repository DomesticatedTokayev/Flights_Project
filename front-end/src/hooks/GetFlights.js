import axios from "axios";

/*
    origin: "",
    destination: "",
    from: "",
    to: "",
    return: "",
    maxPrice: "",
    minStay: "",
    maxStay: "",
*/

export default async function getFlight(props) {
    
    const query = {
        origin: props.origin,
        destination: props.destination,
        from: props.from,
        to: props.to,
        return: props.return,
        maxprice: props.maxPrice,
        minstay: props.minStay,
        maxstay: props.maxStay,
    }

    const configuration = {
        method: "post",
        url: "http://localhost:3000/searchflights",
        params: query
    }

    console.log(configuration);

    axios(configuration)
        .then(result => {
            console.log(result);
        }).catch(error => {
            console.log(error);
    })
}