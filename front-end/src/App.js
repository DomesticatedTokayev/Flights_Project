import { useState, useEffect } from "react";
import { BrowserRouter,  Routes, Route } from "react-router-dom";
import "./styles/style.css";
import ProtectedRoutes from "./components/ProtectedRoutes.js";

import AuthProvider from "./hooks/AuthProvider.js";

import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import SignIn from "./Pages/SignIn.js";
import Home from "./Pages/Home.js";
import CustomFlights from "./Pages/SavedFlights.js";
import Account from "./Pages/Account.js";
import AccountDetails from "./Pages/AccountDetails.js"

import FlightData from "./hooks/FlightsProvider.js";
// Context Test
import TopAccess from "./Tests/TopAccessProvider.js";
import NewFlight from "./Pages/newFlight.js";

const baseURL = "http://localhost:4000";

function App() {

  return (
  <AuthProvider>
      <TopAccess>
      <Header />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-up" element={<SignIn isLogin={false} />} />
            <Route path="/log-in" element={<SignIn isLogin={true} />} />
            <Route element={<ProtectedRoutes />}>  
              <Route path="/saved/flights" element={<CustomFlights />} />
              <Route path="/saved/flights/new/flight" element={<NewFlight />} />
              <Route path="/saved/flights/edit/flight" element={<NewFlight />} />
              <Route path="/account" element={<Account />} />
              <Route path="/account/details" element={<AccountDetails/>} />
            </Route>
          </Routes>
        </BrowserRouter>  
      <Footer />
      </TopAccess>
    </AuthProvider>
  );
}

export default App;