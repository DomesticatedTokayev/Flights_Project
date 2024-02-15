import { useState, useEffect } from "react";
import { BrowserRouter,  Routes, Route } from "react-router-dom";
import axios from "axios";
import "./styles/style.css";
import ProtectedRoutes from "./components/ProtectedRoutes.js";

import AuthProvider from "./components/AuthProvider.js";

import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import SignIn from "./components/SignIn.js";
import Home from "./components/Home.js";
import CustomFlights from "./components/CustomFlights.js";
import AccountSubscription from "./components/AccountSubscription.js"

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
            <Route path="/" element={<Home/>}/>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/free" element={<AccountSubscription />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/auth" element={<CustomFlights/>}/>
            </Route>
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


/*
To Do: (Practice)
-Create branch
-Create files
-Merge branches
-Get used to creating and working on different branches.
*/
