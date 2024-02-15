import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("site" || ""));

    
    function storeToken(token){
        console.log(token);

        setUser(user);
        // setToken(token);
        localStorage.setItem("site", token);
        return;
    };

    const removeToken = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("site");
    };
    
    return <AuthContext.Provider value={{token, user, storeToken, removeToken}}>{children}</AuthContext.Provider>
};

export default AuthProvider;

// Custom hook that utilizes useContext to access the authenticated context from within components
export const useAuth = () => {
    return useContext(AuthContext);
}