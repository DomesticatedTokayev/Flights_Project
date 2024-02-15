import { useState } from "react";
import React from "react";
import axios from "axios";
// import Cookies from "universal-cookie";
// const cookies = new Cookies();
import { useAuth } from "./AuthProvider";


function SignIn()
{
    const auth = useAuth();

    const [login, setLogin] = useState({
        email: "",
        password: "",
    });

    const [register, setRegister] = useState({
        email: "",
        password: "",
    });

    function handleLogin(event)
    {
        const { value, name } = event.target;

        setLogin((prevValue) => {
            switch (name) {
                case "email": {
                    return { email: value, password: prevValue.password };
                }
                case "password": {
                    return { email: prevValue.email, password: value };
                }
            };
        });
    };

    function handleRegistration(event)
    {
        const { value, name } = event.target;
       
        setRegister((prevValue) => {
            switch (name) {
                case "email": {
                    return { email: value, password: prevValue.password };
                }
                case "password": {
                    return { email: prevValue.email, password: value };
                }
                default: {
                    return;
                }
            };
        });

    };

    const handleSubmitRegister = (e) => {
        e.preventDefault();

        const configuration = {
            method: "post",
            url: "http://localhost:4000/register",
            data: {
                email: register.email,
                password: register.password,
            },
        };

        axios(configuration)
            .then((result) => {
                console.log(result)
                // On registration, redirect to sign-in
                window.location.href = "/sign-in";
            })
            .catch((error) => {
                console.log(error)
            });
        
    };

    const handleSubmitLogin = (e) => {
        e.preventDefault();



        const configuration = {
            method: "post",
            url: "http://localhost:4000/login",
            data: {
                email: login.email,
                password: login.password,
            },
        };

        axios(configuration)
            .then((result) => {
                console.log(result)
                //  Set the cookie (Makes the cookie available at "/" path. Thus, all pages)
                auth.storeToken(result.data.token);
                //cookies.set("TOKEN", result.data.token, { path: "/" });
                window.location.href = "/";
            })
            .catch((err) => {
                console.log(err)
            });
        
    }

    return <footer>
        <div className="register">
        <h1>Register</h1>
        <form onSubmit={(e)=>handleSubmitRegister(e)}> 
          <label>Email</label>
                <input
                    onChange={(e)=>handleRegistration(e)}
                    name="email"
                    type="text"
                    value={register.email}
                    required>
                    </input>
          <label>Password</label>
                <input
                    onChange={(e)=>handleRegistration(e)}
                    name="password"
                    type="password"
                    value={register.password}
                    required>
                    </input>
          <button type="Submit">Submit</button>
        </form>
      </div>

      <div className="login">
      <h1>Login</h1>
            <form onSubmit={(e) =>handleSubmitLogin(e)}>
          <label>Email</label>
                <input
                    name="email"
                    type="text"
                    value={login.email}
                    onChange={(e)=>handleLogin(e)}
                    required>
                    </input>
          <label>Password</label>
                <input
                    name="password"
                    type="password"
                    value={login.password}
                    onChange={(e)=>handleLogin(e)}
                    required>
                    </input>
          <button type="submit">Submit</button>
        </form>
      </div>
    </footer>
}

export default SignIn;