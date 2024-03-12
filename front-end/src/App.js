import { useState, useEffect } from "react";
import { BrowserRouter,  Routes, Route } from "react-router-dom";
import "./styles/style.css";
import ProtectedRoutes from "./components/ProtectedRoutes.js";

import AuthProvider from "./hooks/AuthProvider.js";

import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import SignIn from "./Pages/SignIn.js";
import Home from "./Pages/Home.js";
import CustomFlights from "./Pages/CustomFlights.js";
import Account from "./Pages/Account.js";
import AccountSubscription from "./Pages/AccountSubscription.js"
import AccountDetails from "./Pages/AccountDetails.js"

import FlightData from "./hooks/FlightsProvider.js";
// Context Test
import TopAccess from "./Tests/TopAccessProvider.js";
import NewFlight from "./Pages/newFlight.js";

//  Resources used to link back-end and front-end
//https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5
//https://www.freecodecamp.org/news/how-to-build-a-fullstack-authentication-system-with-react-express-mongodb-heroku-and-netlify/#how-to-login-a-user
//https://www.npmjs.com/package/jsonwebtoken#usage

const baseURL = "http://localhost:4000";

function App() {

  return (
  <AuthProvider>
      <TopAccess>
      <Header />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/free" element={<AccountSubscription />} />
            <Route element={<ProtectedRoutes />}>  
              <Route path="/custom" element={<CustomFlights />} />
              <Route path="/newFlight" element={<NewFlight />} />
              <Route path="/account" element={<Account />} />
              <Route path="/accountDetails" element={<AccountDetails/>} />
            </Route>
          </Routes>
        </BrowserRouter>  
      <Footer />
      </TopAccess>
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

