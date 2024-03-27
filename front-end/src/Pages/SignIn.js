import { useState } from "react";
import React from "react";
import axios from "axios";
// import Cookies from "universal-cookie";
// const cookies = new Cookies();
import { useAuth } from "../hooks/AuthProvider";

import LoginDetails from "../components/LoginDetails";
import { validatePassword, validateEmail } from "../components/EmailPasswordValidation";

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
        function checkPasswordLength() {
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
                //console.log("Password doesn't meet minimum requirements");
                setWeakPassword(true);
                return false;
            }
            return true;
        }

        const validEmail = checkValidEmail();
        const passwordLength = checkPasswordLength();
        const passwordReq =  checkPasswordRequirements();

        // Check both password length, password req and email are valid
        if (!validEmail || !passwordLength || !passwordReq)
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
                // On registration, redirect to sign-in
                window.location.href = "/sign-in";
            })
            .catch((error) => {
                // Error Code 5 = Email already exists
                if (error.response.data.errorCode === "A5") {
                    //alert("Email already in use");
                    setEmailAlreadyInUse(true);
                }else {
                    //alert("Unknown error");
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
        // If email is incorrect, show error
        //setIncorrectLoginEmail(true);

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
                const errorCode = err.response.data.errorCode;
                if (errorCode === "A10") {
                    //alert("Email not Found");
                    setEmailNotFound(true);
                } else if (errorCode === "A20") {
                    //alert("Incorrect password");
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

        setRegister((prevValue) => ({ ...prevValue, [name]: value }));

        if (name === "email") {
            setEmailAlreadyInUse(false);
            setInvalidRegistrationEmail(false);
        }
        
        // Check for Uppercase character
        // Check for one digit
        // check for at least 8 characters
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
            <h1>Log-in / Register</h1>
            <button>Continue with Google</button>
            <div className="login__divider">
                <hr></hr>
                <h3>Or</h3>
                <hr></hr>
            </div>

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
                <p>Don't have an account? Sign-up</p>
            </form>

            
            <form className="login__form" onSubmit={(e) => submitRegister(e)}>
                <label htmlFor="forename">Forename</label>
                <input type="text" name="forenhandleSubmitRegisterame" id="forename" onChange={(e)=>handleRegister(e)} value={register.forename}></input>
                <label htmlFor="surname">Surname</label>
                <input type="text" name="surname" id="surname"  onChange={(e)=>handleRegister(e)} value={register.surname}></input>
                <label htmlFor="email">Email</label>
                <input className={(emailAlreadyInUse || invalidRegistrationEmail) && "red_border"} type="text" id="email" name="email" required value={register.email} onChange={(e) => handleRegister(e)}></input>
                {emailAlreadyInUse && <p className="error_text red-text">Email already in use</p>}
                {invalidRegistrationEmail && <p className="error_text red-text">Invalid email</p>}
                <label htmlFor="password">Password</label>
                <input className={(weakPassword) && "red_border"} type="password" id="password" name="password" required value={register.password} onChange={(e) => handleRegister(e)}></input>        
                {weakPassword && <p className="error_text red-text">Weak password</p>}
                <div className="password_strength">
                    <p className={passwordStrength.upperCase ? "green" : "grey-text"}>At least one upper case letter</p>
                    <p className={passwordStrength.lowerCase ? "green" : "grey-text"}>At least one lower case letter</p>
                    <p className={passwordStrength.digit ? "green" : "grey-text"}>At least one number</p>
                    <p className={passwordStrength.length ? "green" : "grey-text"}>At least 8 letter</p>
                </div>
                <label htmlFor="password_check">Re-enter Password</label>
                <input className={(weakPassword || passwordsDontMatch) && "red_border"} type="password" id="password_check" name="password_check" value={register.password_check} onChange={(e)=>handleRegister(e)}></input>
                {passwordsDontMatch && <p className="error_text red-text">Passwords don't match!</p>}
                
                <button type="submit" className="button">Register</button>

                <p> Already have an account? Log-in</p>
            </form>
        </div>
    </main>
}

export default SignIn;