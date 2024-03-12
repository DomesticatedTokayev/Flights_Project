import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(localStorage.getItem("YourFlights_user" || ""));
    const [token, setToken] = useState(localStorage.getItem("YourFlights" || ""));

    
    function storeToken(token, user){
        setUser(user);
        setToken(token);
        localStorage.setItem("YourFlights", token);
        localStorage.setItem("YourFlights_user", user);
        return;
    };

    const removeToken = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("YourFlights");
        localStorage.removeItem("YourFlights_user");
    };
    
    return <AuthContext.Provider value={{token, user, storeToken, removeToken}}>{children}</AuthContext.Provider>
};

export default AuthProvider;

// Custom hook that utilizes useContext to access the authenticated context from within components
export const useAuth = () => {
    return useContext(AuthContext);
}