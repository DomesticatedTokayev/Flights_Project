import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import "./styles/style.css";

import Header from "./components/Header.js";
import Footer from "./components/Footer.js";

const baseURL = "http://localhost:4000";

function App() {

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


  return (
    <>
      <Header/>
      
      <Footer/>
      </>
  );
}

export default App;


/*
To Do: (Practice)
-Create branch
-Create files
-Merge branches
-Get used to creating and working on different branches.
*/
