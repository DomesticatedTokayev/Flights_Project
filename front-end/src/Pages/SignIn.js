import { useState } from "react";
import React from "react";
import axios from "axios";
// import Cookies from "universal-cookie";
// const cookies = new Cookies();
import { useAuth } from "../hooks/AuthProvider";

import LoginDetails from "../components/LoginDetails";

// Google Authentication
// https://medium.com/@sahadmuhammed289/react-js-a-step-by-step-guide-to-google-authentication-926d0d85edbd

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
        password_check: "",
        forename: "",
        surname: "",
    });

    const handleSubmitRegister = (e) => {
        e.preventDefault();

        if (register.password !== register.password_check)
        {
            alert("Passwords don't match");
            return;
        }
    

        const configuration = {
            method: "post",
            url: "/register",
            data: {
                email: register.email,
                password: register.password,
                forename: register.forename,
                surname: register.surname,
            },
        };

        axios(configuration)
            .then((result) => {
                // On registration, redirect to sign-in
                window.location.href = "/sign-in";
            })
            .catch((error) => {
                // Error Code 5 = Email already exists
                if (error.response.data.errorCode === "A5") {
                    alert("Email already in use");
                }else {
                    alert("Unknown error");
                }
            });
        
    };

    const handleSubmitLogin = (e) => {
        e.preventDefault();

        const configuration = {
            method: "post",
            url: "/login",
            data: {
                email: login.email,
                password: login.password,
            },
        };

        axios(configuration)
            .then((result) => {
                //console.log(result.data);
                //  Set the cookie (Makes the cookie available at "/" path. Thus, all pages)
                auth.storeToken(result.data.token, result.data.email);
                //cookies.set("TOKEN", result.data.token, { path: "/" });
                window.location.href = "/";
            })
            .catch((err) => {
                // Error Code 10 = Incorrect Email
                // Error code 20 = Incorrect Password
                const errorCode = err.response.data.errorCode;
                if (errorCode === "A10") {
                    alert("Email not Found");
                } else if (errorCode === "A20") {
                    alert("Incorrect password");
                } else {
                    alert("Unknown error");
                }
            });
    }

    function handleLogin(event) {
        const { name, value } = event.target;

        setLogin((prevValue) => ({ ...prevValue, [name]: value }));
    }

    function handleRegister(event)
    {
        const { name, value } = event.target;

        setRegister((prevValue) => ({ ...prevValue, [name]: value }));
        console.log(register.password_check);
    }

    return <main>
        <div className="login">
            <h1>Log-in / Register</h1>
            <button>Continue with Google</button>
            <div className="login__divider">
                <hr></hr>
                <h3>Or</h3>
                <hr></hr>
            </div>

            <form className="login__form" onSubmit={(e)=>handleSubmitLogin(e)}>
                <LoginDetails 
                    email={login.email}
                    password={login.password}
                    handleEmail={handleLogin}
                    handlePassword={handleLogin}
                />
                <p>Forgot Password?</p>
                <button type="submit" className="button">Log in</button>
                <p>Don't have an account? Sign-up</p>
            </form>

            
            <form className="login__form" onSubmit={(e) => handleSubmitRegister(e)}>
                <label htmlFor="forename">Forename</label>
                <input type="text" name="forename" id="forename" onChange={(e)=>handleRegister(e)} value={register.forename}></input>
                <label htmlFor="surname">Surname</label>
                <input type="text" name="surname" id="surname"  onChange={(e)=>handleRegister(e)} value={register.surname}></input>
                <LoginDetails 
                    email={register.email}
                    password={register.password}
                    handleEmail={handleRegister}
                    handlePassword={handleRegister}
                />
                <label htmlFor="password_check">Re-enter Password</label>
                <input type="password" id="password_check" name="password_check" value={register.password_check} onChange={(e)=>handleRegister(e)}></input>

                <button type="submit" className="button">Register</button>

                <p> Already have an account? Log-in</p>
            </form>
        </div>
    </main>
}

export default SignIn;