import { createContext, useContext, useState } from "react";

const FlightsDataProvider = createContext();

const FlightData = ({children}) =>
{
    const [flightData, setFlightData] = useState({
        id: undefined,
        origin: undefined,
        destination: undefined,
        from: undefined,
        to: undefined,
        return: undefined,
        maxPrice: undefined,
        minStay: undefined,
        maxStay: undefined,
    });

    function setData(name, value) {
        setFlightData((prevValue) => ({...prevValue, [name]: value}));
    }

    return <FlightsDataProvider.Provider value={{flightData, setData}}>{children}</FlightsDataProvider.Provider>
}

export default FlightData;

export const useFlightData = () => {
    return useContext(FlightsDataProvider);
}