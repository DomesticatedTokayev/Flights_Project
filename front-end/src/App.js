import { useState, useEffect } from "react";
import { BrowserRouter,  Routes, Route } from "react-router-dom";
import axios from "axios";
import "./styles/style.css";
import ProtectedRoutes from "./hooks/ProtectedRoutes.js";

import AuthProvider from "./hooks/AuthProvider.js";

import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import SignIn from "./Pages/SignIn.js";
import Home from "./Pages/Home.js";
import CustomFlights from "./Pages/CustomFlights.js";
import AccountSubscription from "./Pages/AccountSubscription.js"

//  Resources used to link back-end and front-end
//https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5
//https://www.freecodecamp.org/news/how-to-build-a-fullstack-authentication-system-with-react-express-mongodb-heroku-and-netlify/#how-to-login-a-user
//https://www.npmjs.com/package/jsonwebtoken#usage

const baseURL = "http://localhost:4000";

function App() {

  return (
      <AuthProvider>
        <Header />
            <BrowserRouter>
              <Routes>
              <Route path="/" element={<Home />} />
              {/* Enable when authentication is required */}
              <Route element={<ProtectedRoutes />}>
                <Route path="/auth" element={<CustomFlights/>}/>
              </Route>
              {/* <Route path="/auth" element={<CustomFlights/>}/> */}
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/free" element={<AccountSubscription />} />
              </Routes>
            </BrowserRouter>  
        <Footer />
      </AuthProvider>
  );
}

export default App;
  //const [data, setData] = useState(null);

  // useEffect(() => {
  //   axios.get(`${baseURL}/`).then((res) => {
  //     setData(res.data);
  //   }).catch(err => {
  //     console.log(err);
  //   });
  // }, []);
  
  // useEffect(() => {
  //   const data = {
  //     name: "Tita",
  //     body: "To the server!"
  //   }

  //   axios.post(`${baseURL}/data`, data).then((res) => {
  //     console.log(res.data);
  //     setData(res.data);
  //   }).catch(err => {
  //     console.log(err);
  //   })
  // }, []);

