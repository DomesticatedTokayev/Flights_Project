import React from "react";

function loginDetails(props)
{
    return <>
        <label htmlFor="email">Email</label>
        <input type="text" id="email" name="email" required value={props.email} onChange={(e)=>props.handleEmail(e)}></input>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" required value={props.password} onChange={(e)=>props.handlePassword(e)}></input>
    </>
}

export default loginDetails;