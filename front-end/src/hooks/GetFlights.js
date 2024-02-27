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
    
    let withReturn = props.return === "return" ? true : false;

    const query = {
        origin: props.origin,
        destination: props.destination,
        from: props.from,
        to: props.to,
        return: withReturn,
        maxprice: props.maxPrice,
        minstay: props.minStay,
        maxstay: props.maxStay,
    }

    const configuration = {
        method: "post",
        url: "http://localhost:3000/searchflights",
        params: query
    }

    axios(configuration)
        .then(result => {
            console.log(result);
        }).catch(error => {
            console.log(error);
        })
    
    
}