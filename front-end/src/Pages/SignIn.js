import { useState } from "react";
import React from "react";
import axios from "axios";
// import Cookies from "universal-cookie";
// const cookies = new Cookies();
import { useAuth } from "../hooks/AuthProvider";

import LoginDetails from "../components/LoginDetails";

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
    });


    // function handleRegistration(event)
    // {
    //     const { value, name } = event.target;
       
    //     setRegister((prevValue) => {
    //         switch (name) {
    //             case "email": {
    //                 return { email: value, password: prevValue.password };
    //             }
    //             case "password": {
    //                 return { email: prevValue.email, password: value };
    //             }
    //             default: {
    //                 return;
    //             }
    //         };
    //     });

    // };

    const handleSubmitRegister = (e) => {
        e.preventDefault();

        if (register.password !== register.password_check)
        {
            alert("Passwords don't match");
            return;
        }

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
                auth.storeToken(result.data.token, result.data.name);
                //cookies.set("TOKEN", result.data.token, { path: "/" });
                window.location.href = "/";
            })
            .catch((err) => {
                console.log(err)
            });
    }

    function handleLogin(event) {
        const { name, value } = event.target;

        setLogin((prevValue) => ({ ...prevValue, [name]: value }));
        console.log(login.email);
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

            
            <form className="login__form" onSubmit={(e)=>handleSubmitRegister(e)}>
                <LoginDetails 
                    email={register.email}
                    password={register.password}
                    handleEmail={handleRegister}
                    handlePassword={handleRegister}
                />
                <label htmlFor="password_check">Re-enter Password</label>
                <input type="password" id="password_check" name="password_check" value={register.password_check} onChange={(e)=>handleRegister(e)}></input>

                <button type="submit" className="button">Log in</button>

                <p> Already have an account? Log-in</p>
            </form>
        </div>
    </main>
}

export default SignIn;


{/* <label htmlFor="email">Email</label>
<input type="text" id="email" name="email"></input>
<label htmlFor="password">Password</label>
<input type="text" id="password" name="password"></input> */}

{/* <div className="register">
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
      </div> */}