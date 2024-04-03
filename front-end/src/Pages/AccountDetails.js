import React from "react";
import axios from "axios"
import DetailsEntry from "../components/DetailsEntry"
import { useAuth } from "../hooks/AuthProvider";
import { validatePassword, validateEmail } from "../components/EmailPasswordValidation";
// Password and email validation
// 

function AccountDetails()
{
    const [details, setDetails] = React.useState({
        email: "",
        // password: "",
        forename: "",
        surname: "",
    });

    const [currentPassword, setCurrentPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [passwordCheck, setPasswordCheck] = React.useState("");

    // Return if user enters incorrect password
    const [incorrectCurrentPassword, setIncorrectPassword] = React.useState(false);

    const [invalidEmail, setInvalidEmail] = React.useState(false);
    const [weakPassword, setWeakPassword] = React.useState(false);
    const [passwordNotMatch, setPasswordNotMatch] = React.useState(false);


    const auth = useAuth();
    const isMounted = React.useRef(false);
    const [showMessage, setShowMessage] = React.useState(false);
    const [savedValue, setSavedValue] = React.useState({
        message: "",
        wasSaved: false,
    });

    const [passwordStrength, setPasswordStrenght] = React.useState({
        upperCase: false,
        lowerCase: false,
        digit: false,
        length: false,
    });

    const [isEditing, setIsEditing] = React.useState(false);
    const [updated, setUpdated] = React.useState(false);

    const [isLoading, setIsLoading] = React.useState(false);

    function updateDetails(name, value)
    {
        setDetails((prevValue) => ({ ...prevValue, [name]: value }));
    }

    function SetSaved(newName, value){
        setSavedValue((prevValue) => ({...prevValue, message : newName, wasSaved: value }));
    
        setShowMessage(true);

        // Remove message after short duration
        setTimeout(() => {
            setShowMessage(false);
        }, 3000);
    };

    function toggleEditing()
    {
        setUpdated(false);
        setIsEditing(prevValue => (!prevValue));
    }

    React.useEffect(() => {
        getDetails();
    }, [])

    React.useEffect(() => {
        if (isMounted.current) {
            // Show data saved for short duration
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 3000)
        } else {
            isMounted.current = true;
        }
        
    }, [savedValue]);


    function handleNewEmail(event) {

        const newEmail = event.target.value;
        setInvalidEmail(false);
        updateDetails("email", newEmail);
    };

    function handleCurrentPassword(password)
    {
        //Reset incorrect password error
        setIncorrectPassword(false);
        setCurrentPassword(password);
    }

    function handleNewPassword(password)
    {
        // Reset password errors
        setPasswordNotMatch(false);
        setWeakPassword(false);

        setNewPassword(password);

        return checkPasswordStrength(password);
    };

    function checkPasswordStrength(password)
    {
        setPasswordStrenght(validatePassword(password));

        if ((passwordStrength.upperCase &&
            passwordStrength.lowerCase &&
            passwordStrength.digit &&
            passwordStrength.length))
        {
            return true;
        }
        else {
            return false;
        }
    }

    function handlePasswordCheck(password)
    {
        setPasswordCheck(password);
        // Reset password errors
        setPasswordNotMatch(false);
    }

    async function sendUpdatedDetails(event)
    {
        event.preventDefault();
        
        // cehck valid email, and return early if incorrect.
        if (!checkValidEmail())
        {
            return;
        }

        function checkValidEmail() {
            if (validateEmail(details.email)) {
                return true;
            } else {
                // Show error: invalid email
                setInvalidEmail(true);
                return false;
            }
        };

        // Return early if passwrod is weak or doesn't match
        if (currentPassword.length > 0 )
        {
            const passwordMatch = checkPasswordMatch();
            const strongPassword = passwordStrength();

            if (!passwordMatch || !strongPassword)
            {
                return;    
            }

            function checkPasswordMatch() {
                if( newPassword === passwordCheck) {
                    return true; 
                } else {
                    // Show error mismatch
                    setPasswordNotMatch(true);
                    return false;  
                }
            };
    
            function passwordStrength() {
                //check again, otherwise it will miss the last character
                if (checkPasswordStrength(newPassword)) {
                    return true;
                } else {
                    // Show error weak password
                    setWeakPassword(true);
                    return false;
                }
            };
        }
     
        const body = {
            forename: details.forename,
            surname: details.surname,
            email: details.email,
            password: newPassword,
            currentPassword: currentPassword,
        };

        const config = {
            method: "put",
            url: "/account",
            headers: {
                Authorization: `Bearer: ${auth.token}`,
            },
            data: body,
        };


        await axios(config)
            .then((result) => {
                updateDetails("forename", result.data.data.forename);
                updateDetails("surname", result.data.data.surname);
                updateDetails("email", result.data.data.email);

                setNewPassword("");
                setCurrentPassword("");
                setPasswordCheck("");

                //("Details Updated", true);
                setUpdated(true);
                setIsEditing(false);
                
                auth.storeToken(result.data.newToken, result.data.data.email);
            })
            .catch((error) => {
 
                const errorCode = error.response.data.errorCode;
                
                switch (errorCode) {
                    case "S100": {
                        SetSaved("Couldn't Update Details", false);
                        break;
                    }
                    case "S105": {
                        SetSaved("Invalid email", false);
                        break;
                    }
                    case "S106": {
                        setIncorrectPassword(true);
                        SetSaved("Incorrect password", false);
                        break;
                    }
                    case "S120": {
                        SetSaved("Password doesn't meet minimum requirements", false);
                        break;
                    }
                    case "U10": {
                        SetSaved("Error Saving Details", false);
                        break;
                    }
                    default: {
                        SetSaved("Error Saving Details", false);
                        break;
                    }
                }
                setNewPassword("");
            });
        

    };

    async function getDetails() {
        const config = {
            method: "get",
            url: "/account",
            headers: {
                Authorization: `Bearer: ${auth.token}`,
            },
        };

        // Set loading data icon
        setIsLoading(true);

        await axios(config)
            .then((result) => {
                setDetails(result.data);
            })
            .catch((error) => {
                const errorCode = error.response.data.errorCode;
                
                switch (errorCode) {
                    case "S90": {
                        SetSaved("Failed to load account details", false);
                        break;
                    }
                    case "U10": {
                        SetSaved("Error loading account details", false);
                        break;
                    }
                    default: {
                        SetSaved("Error loading account details", false);
                        break;
                    }
                }
            }
            );

            // Disable loading icon
            setIsLoading(false);
    };

    async function handleDeleteAccount()
    {
        const config = {
            method: "delete",
            url: "/account",
            headers: {
                Authorization: `Bearer: ${auth.token}`,
            },
        };

        await axios(config)
            .then((result) => {
                auth.removeToken();
                window.location.href = "/";
            })
            .catch(error => {
                const errorCode = error.response.data.errorCode;
                
                switch (errorCode)
                {
                    case "S110": {
                        // alert(error.response.data.message);
                        SetSaved("Failed to delete account", false);
                        break;
                    }
                    case "U10": {
                        // alert("Unknown error");
                        SetSaved("Error Deleting Account", false);
                        break;
                    }
                    default: {
                        // alert("Unknown error");
                        SetSaved("Error Deleting Account", false);
                        break;
                    }
                }
        })
    }

    return <main>
        <div className="account_details">
            <h2 className="title">This is Account Details</h2>

            <div className="entry">
            <div className="entry__data">   
                <p className="entry__name">{"Forename"}</p>
                    <form className="entry__form" onSubmit={sendUpdatedDetails}>
                        {isLoading ? <div className="loader_slot"><div className="loader"></div></div> :
                            <>
                                {!isEditing ? 
                                    <p className="entry__userdata grey-text">{details.forename.length > 0 ? details.forename : "Not set"}</p>
                                    :
                                    <input type="text" id="forename" onChange={(e) => (updateDetails("forename", e.target.value))} value={details.forename}></input> 
                                }
                            </>
                        }
                    </form>
            </div>
            </div>

            <div className="entry">
            <div className="entry__data">   
                <p className="entry__name">{"Surname"}</p>
                    <form className="entry__form" onSubmit={sendUpdatedDetails}>
                        {isLoading ? <div className="loader_slot"><div className="loader"></div></div> :
                            <>
                                {!isEditing ?
                                    <p className="entry__userdata grey-text">{details.surname.length > 0 ? details.surname : "Not set"}</p>
                                    :
                                    <input type="text" id="surname" onChange={(e) => (updateDetails("surname", e.target.value))} value={details.surname}></input>
                                }
                            </>
                        }
                    </form>
            </div>
            </div>
            
            <div className="entry">
            <div className="entry__data">   
                <p className="entry__name">{"Email"}</p>
                    <form className="entry__form" onSubmit={sendUpdatedDetails}>
                    {isLoading ? <div className="loader_slot"><div className="loader"></div></div> :
                        <>
                            {!isEditing ?
                                <p className="entry__userdata grey-text">{details.email}</p>
                                :
                                <>
                                    <input className={invalidEmail && "red_border"} type="text" id="email" onChange={handleNewEmail} value={details.email} required></input>  
                                    {passwordNotMatch && <p className="red-text error_text">Passwords don't match!</p>}
                                    {invalidEmail && <p className="red-text error_text">Invalid Email</p>}
                                </>
                            }
                        </>
                    }
                    </form>
            </div>
            </div>

            <div className="entry">
            <div className="entry__data">   
                <p className="entry__name">{"Password"}</p>
                    <form className="entry__form" onSubmit={sendUpdatedDetails}>
                        <p className="entry__userdata grey-text">{"********"}</p>
                        {isEditing && <>
                            <label htmlFor="current_password">Current Password</label>
                            <input className={incorrectCurrentPassword && "red_border"} type="text" id="current_password" name="current_password" onChange={(e)=>handleCurrentPassword(e.target.value)} value={currentPassword} required></input> 
                            {incorrectCurrentPassword && <p className="error_text red-text">Incorrect password</p>}
                            <label htmlFor="new_password">New Password</label>
                            <input className={(passwordNotMatch || weakPassword) && "red_border"} type="text" id="new_password" name="new_password" onChange={(e) => handleNewPassword(e.target.value)} value={newPassword} required></input> 
                            {weakPassword && <p className="red-text error_text">Weak Password</p>}
                            <div className="password_strength">
                                <p className={passwordStrength.upperCase ? "green" : "grey-text"}>At least one upper case letter</p>
                                <p className={passwordStrength.lowerCase ? "green" : "grey-text"}>At least one lower case letter</p>
                                <p className={passwordStrength.digit ? "green" : "grey-text"}>At least one number</p>
                                <p className={passwordStrength.length ? "green" : "grey-text"}>At least 8 letter</p>
                            </div>
                            <label htmlFor="re-enter_password">Re-enter Password</label>
                            <input className={(passwordNotMatch) && "red_border"} type="text" id="re-enter_password" name="re-enter_password" onChange={(e) => handlePasswordCheck(e.target.value)} value={passwordCheck} required></input> 
                            {passwordNotMatch && <p className="red-text error_text">Passwords don't match!</p>}
                        </>
                    }
                    </form>
            </div>
            </div>

            {showMessage === true &&
                <div className="error-message">
                    <p className={showMessage ? "show red-text" : "hidden"}>
                        {savedValue.message}
                    </p>
                </div>
            }

            {updated && <>
                <p className="green"> Details Updated</p>
            </>}
            
            <div>
                {!isLoading && <>{!isEditing && <button className="button" onClick={toggleEditing}>Update</button>}</>}
                
                {isEditing && <button className="button" onClick={sendUpdatedDetails}>Save</button>}
                {isEditing && <button className="button" onClick={toggleEditing}>Cancel</button>}
            </div>

            <button className="delete_account red-text" onClick={() => handleDeleteAccount()}>Delete Account</button>
        </div>
    </main>
}

export default AccountDetails;


{/* <DetailsEntry 
                    entryName={"Email"}
                    entryValue={details.email}
                    handleSave={handleNewEmail}
                />
                <DetailsEntry 
                    entryName={"Password"}
                    entryValue={"********"}
                    validationRequired={true}
                    handleSave={handleNewPassword}
                />
                <DetailsEntry
                    entryName={"Forename"}
                    entryValue={details.forename} 
                    handleSave={handleNewForename}
                    />
                <DetailsEntry
                    entryName={"Surname"}
                    entryValue={details.surname}
                    handleSave={handleNewSurname}
                /> */}

                
    // function validateEmail(email) {
    //     const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    //     return regex.test(email);
    // }

        // // Insert into own component
    // function validatePassword(password) {
    //     const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    //     return regex.test(password);
    // };