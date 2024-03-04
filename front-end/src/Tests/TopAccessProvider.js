import { createContext, useContext, useState } from "react";

const TopAccessProvider = createContext();

const  TopAccess = ({ children }) => {
    const [data, setData] = useState("Hello");
    const [age, setAge] = useState("World");

    function PrintAlert(data)
    {
        alert(data);
    }

    return <TopAccessProvider.Provider value={{data, age, PrintAlert}}>{children}</TopAccessProvider.Provider>
};

export default TopAccess;

export const useTopAccess = () => {
    return useContext(TopAccessProvider);
}