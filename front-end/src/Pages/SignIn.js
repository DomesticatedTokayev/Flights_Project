import { useState } from "react";
import React from "react";
import axios from "axios";
// import Cookies from "universal-cookie";
// const cookies = new Cookies();
import { useAuth } from "../hooks/AuthProvider";

import { validatePassword, validateEmail } from "../components/EmailPasswordValidation";

// Google Authentication
// https://medium.com/@sahadmuhammed289/react-js-a-step-by-step-guide-to-google-authentication-926d0d85edbd

function SignIn(props)
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

    const [passwordStrength, setPasswordStrenght] = React.useState({
        upperCase: false,
        lowerCase: false,
        digit: false,
        length: false,
    });

    //Login error
    const [emailNotFound, setEmailNotFound] = React.useState(false);
    const [incorrectLoginEmail, setIncorrectLoginEmail] = React.useState(false);
    const [incorrectPassword, setIncorrectPassword] = React.useState(false);

    // Registration
    const [weakPassword, setWeakPassword] = React.useState(false);
    const [emailAlreadyInUse, setEmailAlreadyInUse] = React.useState(false);
    const [invalidRegistrationEmail, setInvalidRegistrationEmail] = React.useState(false);
    const [passwordsDontMatch, setPasswordsDontMatch] = React.useState(false);

    const submitRegister = (e) => {
        e.preventDefault();

        const validEmail = checkValidEmail();
        const passwordMatch = checkPasswordMatch();
        const passwordReq =  checkPasswordRequirements();

        // Check if email is valid
        function checkValidEmail() {
            if (!validateEmail(register.email))
            {
                setInvalidRegistrationEmail(true);
                return false;
            }
            return true;
        }
    
        // Check password length
        function checkPasswordMatch() {
            if (register.password !== register.password_check)
            {
                setPasswordsDontMatch(true);
                return false;
            }
            return true;
        }

        function checkPasswordRequirements() {
            if (!(passwordStrength.upperCase &&
                passwordStrength.lowerCase &&
                passwordStrength.digit && 
                passwordStrength.length)) {
                setWeakPassword(true);
                return false;
            }
            return true;
        }

        // Check both password length, password req and email are valid
        if (!validEmail || !passwordMatch || !passwordReq)
        {
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
                window.location.href = "/log-in";
            })
            .catch((error) => {
                // Error Code 5 = Email already exists
                if (error.response.data.errorCode === "A5") {
                    setEmailAlreadyInUse(true);
                }else {
                    setEmailAlreadyInUse(true);
                }
            });
        
    };

    const submitLogin = (e) => {
        e.preventDefault();

        // Check email (formatting)
        if (!validateEmail(login.email)) {
            setIncorrectLoginEmail(true);
            return;
        }

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
                //  Set the cookie (Makes the cookie available at "/" path. Thus, all pages)
                auth.storeToken(result.data.token, result.data.email);
                //cookies.set("TOKEN", result.data.token, { path: "/" });
                window.location.href = "/";
            })
            .catch((err) => {
                const errorCode = err.response.data.errorCode;
                if (errorCode === "A10") {
                    setEmailNotFound(true);
                } else if (errorCode === "A20") {
                    setIncorrectPassword(true);
                } else {
                    alert("Unknown error");
                }
            });
    };

    function handleLogin(event) {
        const { name, value } = event.target;

        setLogin((prevValue) => ({ ...prevValue, [name]: value }));

        if (name === "email") {
            setEmailNotFound(false);
            setIncorrectLoginEmail(false);
        } else if (name === "password")
        {
            setIncorrectPassword(false);
        }
    };
   
    function handleRegister(event)
    {
        const { name, value } = event.target;
        console.log(name);
        setRegister((prevValue) => ({ ...prevValue, [name]: value }));

        if (name === "email") {
            setEmailAlreadyInUse(false);
            setInvalidRegistrationEmail(false);
        }
        
        if (name === "password") {
            //Check password strenght here
            setPasswordStrenght(validatePassword(value));
            setWeakPassword(false);
        }

        if (name === "password" || name === "password_check") {
            setPasswordsDontMatch(false);
        }
    };

    return <main>
        <div className="login">
            {props.isLogin ?
                <>
                    <h2>Log-in</h2>
                    <form className="login__form" onSubmit={(e)=>submitLogin(e)}>
                        <label htmlFor="email">Email</label>
                        <input className={(emailNotFound || incorrectLoginEmail) && "red_border"} type="text" id="email" name="email" required value={login.email} onChange={(e) => handleLogin(e)}></input>
                        {emailNotFound && <p className="error_text red-text">Email not found</p>}
                        {incorrectLoginEmail && <p className="error_text red-text">Invalid email</p>}
                        <label htmlFor="password">Password</label>
                        <input className={incorrectPassword && "red_border"} type="password" id="password" name="password" required value={login.password} onChange={(e) => handleLogin(e)}></input>
                        {incorrectPassword && <p className="error_text red-text">Incorrect password</p>}
                        <p>Forgot Password?</p>
                        <button type="submit" className="button">Log in</button>
                        <p>Don't have an account? <a href="/Sign-up">Sign-up</a></p>
                    </form>
                </>
                :
                <>  
                    <h2>Sign-up</h2>
                    <form className="login__form" onSubmit={(e) => submitRegister(e)}>
                        <label htmlFor="forename">Forename</label>
                        <input type="text" name="forename" id="forename" onChange={(e)=>handleRegister(e)} value={register.forename}></input>
                        <label htmlFor="surname">Surname</label>
                        <input type="text" name="surname" id="surname"  onChange={(e)=>handleRegister(e)} value={register.surname}></input>
                        <label htmlFor="email">Email</label>
                        <input className={(emailAlreadyInUse || invalidRegistrationEmail) ? "red_border" : ""} type="text" id="email" name="email" required value={register.email} onChange={(e) => handleRegister(e)}></input>
                        {emailAlreadyInUse && <p className="error_text red-text">Email already in use</p>}
                        {invalidRegistrationEmail && <p className="error_text red-text">Invalid email</p>}
                        <label htmlFor="password">Password</label>
                        <input className={(weakPassword) ? "red_border" : ""} type="password" id="password" name="password" required value={register.password} onChange={(e) => handleRegister(e)}></input>        
                        {weakPassword && <p className="error_text red-text">Weak password</p>}

                        <div className="password_strength">
                            <p className={passwordStrength.upperCase ? "green" : "grey-text"}>At least one upper case letter</p>
                            <p className={passwordStrength.lowerCase ? "green" : "grey-text"}>At least one lower case letter</p>
                            <p className={passwordStrength.digit ? "green" : "grey-text"}>At least one number</p>
                            <p className={passwordStrength.length ? "green" : "grey-text"}>At least 8 letter</p>
                        </div>
                        <label htmlFor="password_check">Re-enter Password</label>
                        <input className={(weakPassword || passwordsDontMatch) ? "red_border" : ""} type="password" id="password_check" name="password_check" value={register.password_check} onChange={(e)=>handleRegister(e)}></input>
                        {passwordsDontMatch && <p className="error_text red-text">Passwords don't match!</p>}
                        
                        <button type="submit" className="button">Register</button>

                        <p> Already have an account? <a href="/log-in">Log-in</a></p>
                    </form>
                </>
            }
        </div>
    </main>
}

export default SignIn;