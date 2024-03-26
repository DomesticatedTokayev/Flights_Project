import axios from "axios";

export async function SearchFlightsWithProps(props) {

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

    return await search(query);
};

export async function SearchFlightsWithParam(origin, destination, from, to, max_price, with_Return, min_Stay, max_stay, output_limit)
{
    const query = {
        origin: origin,
        destination: destination,
        from: from,
        to: to,
        return: with_Return,
        max_price: max_price,
        min_stay: min_Stay,
        max_stay: max_stay,
        output_limit: output_limit,
    };

    return await search(query);
};

async function search(query) {
    const configuration = {
        method: "get",
        url: "/search/flights",
        params: query,
    }

    try {
        let result = await axios(configuration)
        return { ok: true, data: result.data, errorType: null, message: null };
    } catch (error)
    {
        console.log(error);
        return { ok: false, data: null, errorCode: error.response.data.errorCode, message: error.response.data.message};
    }
}