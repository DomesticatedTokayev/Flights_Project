import React from "react";
import axios from "axios"
import DetailsEntry from "../components/DetailsEntry"
import { useAuth } from "../hooks/AuthProvider";

function AccountDetails()
{
    const [details, setDetails] = React.useState({
        email: "",
        password: "",
        forename: "",
        surname: "",
    });

    const auth = useAuth();
    const isMounted = React.useRef(false);
    const [showMessage, setShowMessage] = React.useState(false);
    const [savedValue, setSavedValue] = React.useState({
        name: "",
        wasSaved: false,
    });

    function updateDetails(name, value)
    {
        setDetails((prevValue) => ({ ...prevValue, [name]: value }));
    }

    function SetSaved(newName, value){
        setSavedValue((prevValue) => ({...prevValue, name : newName, wasSaved: value }));
    
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
        SetSaved("email", true);
    };

    function handleNewPassword(password)
    {
        updateDetails("password", password);
        // Check if password meets minimum requirements
        SetSaved("password", true);
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
            password: details.password,
        };

        console.log(body);

        const config = {
            method: "post",
            url: "http://localhost:4000/account",
            headers: {
                Authorization: `Bearer: ${auth.token}`,
            },
            data: body,
        };

        await axios(config)
            .then((result) => {
                console.log(result);
            })
            .catch((error) => {
                console.log(error);
        })

    };

    async function getDetails() {
        const config = {
            method: "get",
            url: "http://localhost:4000/account",
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
                console.log(error);
        })
    };

    return <main>
        <div className="account_details">
            <h2 className="title">This is Account Details</h2>
            {/* {showMessage === true && <> */}
            <div className="error-message">
                <p className={showMessage ? "show" : "hidden"}>
                    {savedValue.wasSaved ? "New " + savedValue.name + " was saved" : "Couldn't save " + savedValue.name}
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
        </div>
    </main>
}

export default AccountDetails;