import axios from "axios";

export default async function getFlight(props) {
    
    //let withReturn = props.return === "return" ? true : false;

    const query = {
        origin: props.origin,
        destination: props.destination,
        from: props.from,
        to: props.to,
        return: props.return,
        maxprice: props.maxPrice,
        minstay: props.minStay,
        maxstay: props.maxStay,
        outputLimit: props.outputLimit,
    }

    const configuration = {
        method: "post",
        url: "http://localhost:3000/searchflights",
        params: query
    }

    let data = "";

    await axios(configuration)
        .then(result => {
            data = result;
            
        }).catch(error => {
            console.log(error);
        })
    
    return data;
}