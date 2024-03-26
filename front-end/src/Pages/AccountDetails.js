import React from "react";
import axios from "axios"
import DetailsEntry from "../components/DetailsEntry"
import { useAuth } from "../hooks/AuthProvider";

function AccountDetails()
{
    const [details, setDetails] = React.useState({
        email: "",
        // password: "",
        forename: "",
        surname: "",
    });

    const [newPassword, setNewPassword] = React.useState("");

    const auth = useAuth();
    const isMounted = React.useRef(false);
    const [showMessage, setShowMessage] = React.useState(false);
    const [savedValue, setSavedValue] = React.useState({
        message: "hu",
        wasSaved: false,
    });

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

    // Get details from server
    React.useEffect(() => {
        getDetails();
    },[]);

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

    function handleNewEmail(email) {
        // Check is email is correct, and set if succesfully saved
        updateDetails("email", email);
        //SetSaved("email", true);
    };

    function handleNewPassword(password)
    {
        setNewPassword(password);
        //updateDetails("password", password);
        // Check if password meets minimum requirements
        //SetSaved("password", true);
    };

    function handleNewForename(forame)
    {
        updateDetails("forename", forame);
        //SetSaved("forename", false);
    };

    function handleNewSurname(surname)
    {
        updateDetails("surname", surname);
        //SetSaved("surname", true);
    };

    async function sendUpdatedDetails()
    {
        const body = {
            forename: details.forename,
            surname: details.surname,
            email: details.email,
            // password: details.password,
            password: newPassword,
        };

        const config = {
            method: "put",
            url: "/account", //http://localhost:4000
            headers: {
                Authorization: `Bearer: ${auth.token}`,
            },
            data: body,
        };
        await axios(config)
            .then((result) => {
                //alert("Data updated");

                updateDetails("forename", result.data.data.forename);
                updateDetails("surname", result.data.data.surname);
                updateDetails("email", result.data.data.email);
                
                SetSaved("Details Updated", true);
                
                auth.storeToken(result.data.newToken, result.data.data.email);
            })
            .catch((error) => {
 
                const errorCode = error.response.data.errorCode;
                
                switch (errorCode)
                {
                    case "S100": {
                        // alert(error.response.data.message);
                        SetSaved("Couldn't Update Details", false);
                        break;
                    }
                    case "U10": {
                        // alert("Unknown error");
                        SetSaved("Error Saving Details", false);
                        break;
                    }
                    default: {
                        // alert("Unknown error");
                        SetSaved("Error Saving Details", false);
                        break;
                    }
                }
            })
    };

    async function getDetails() {
        const config = {
            method: "get",
            url: "/account",
            headers: {
                Authorization: `Bearer: ${auth.token}`,
            },
        };

        await axios(config)
            .then((result) => {
                console.log(result);
                setDetails(result.data);
            })
            .catch((error) => {
                const errorCode = error.response.data.errorCode;
                
                switch (errorCode)
                {
                    case "S90": {
                        // alert(error.response.data.message);
                        SetSaved("Failed to load account details", false);
                        break;
                    }
                    case "U10": {
                        // alert("Unknown error");
                        SetSaved("Error loading account details", false);
                        break;
                    }
                    default: {
                        // alert("Unknown error");
                        SetSaved("Error loading account details", false);
                        break;
                    }
                }
        })
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
            {/* {showMessage === true && <> */}
            <div className="error-message">
                <p className={showMessage ? "show" : "hidden"}>
                    {savedValue.message}
                </p>
            </div>
            
            {/* </>} */}
            <div>
                <DetailsEntry 
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
                />
                <button className="button" onClick={sendUpdatedDetails}>Save</button>
                <button className="button">Cancel</button>
            </div>
            <a className="delete_account red-text" onClick={() => handleDeleteAccount()}>Delete Account</a>
        </div>
    </main>
}

export default AccountDetails;