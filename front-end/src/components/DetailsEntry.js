import React from "react";

function DetailsEntry(props) {

    const [value, setValue] = React.useState("");
    const [validationValue, setValidationValue] = React.useState(""); // Change this to include new and re-enter 

    const [editing, setEditing] = React.useState(false);
    const [validationReq, setValidationReq] = React.useState(false);
    const [validationError, setValidationError] = React.useState(false);

    // const [wasSaved, setWasSaved] = React.useState(false);

    React.useEffect(() => {
        setValidationReq(props.validationRequired);
        // setWasSaved(props.handleWasSaved)
    });


    function toggleEdit()
    {
        setEditing((prevValue) => { return !prevValue });
        // setWasSaved(false);
    }

    function stopEditing() {
        setEditing(false);
        // setWasSaved(false);
        setValue("");
        setValidationValue("");
    }

    function handleSave(e)
    {
        e.preventDefault();
        // Check if validation is required
        if (validationReq === true)
        {
            if (value === validationValue) {
                props.handleSave(value);
                stopEditing();
            } else {
                // Show Error
                setValidationError(true);
            }
        }   
        else {
            props.handleSave(value);
            stopEditing();
        }
    }

    return <>
        <div className="entry">
        <div className="entry__data">   
            <p className="entry__name">{props.entryName}</p>

            <p className="entry__userdata grey-text">{props.entryValue}</p>
            <div className={!editing ? "hide" : ""}>
            <form className="entry__form" onSubmit={(e)=>handleSave(e)}>
                <label htmlFor="input">New {props.entryName}</label>
                <input type="text" id="input" onChange={(e)=>setValue(e.target.value)} value={value} required></input> 
                {validationReq === true && <>              
                <label  htmlFor="validation_input">Re-enter {props.entryName}</label>
                <input className={!validationReq ? "hide" : ""} type="text" id="validation_input" onChange={(e) => setValidationValue(e.target.value)} value={validationValue} required></input>
                <div className={!validationReq ? "hide" : ""}>
                    <p className={ validationError ? "show" : "hide"}>{props.entryName} doesn't match!</p>
                </div></>}  
                <div className="entry__buttons">
                    <button className="button" type="submit">Confirm</button>
                    <button className="button" type="reset" onClick={stopEditing}>Cancel</button>
                </div>
            </form>
            
        </div>
            {/* <p className={wasSaved ? "show" : "hide"}>Succesfully Updated!</p> */}
            </div>
            
            <div className="entry__edit">
                <button className={editing ? "hide" : ""} onClick={toggleEdit}>Edit</button>
            </div>
        </div>
    </>
}

export default DetailsEntry;