import { db } from "./db.js";
import { deleteAllFlights } from "./flightsDB.js";
import { hashPassword, comparePasswords } from "../encryption.js";

const saltingRounds = 10;

// Register new user
export async function registerUser(forename, surname, email, password) {

    try
    {
        const hashedPassword = await hashPassword(saltingRounds, password);
        
        // Testing
        //const hashedPassword = password;

        const result = await db.query(`INSERT INTO users (forename, surname, email, password) VALUES($1, $2, $3, $4)`, [forename, surname, email, hashedPassword]);  
        
        if (result.rowCount <= 0) {
            return { ok: false, errorType: "unknown", message: "Unknown error" };
        }

        return { ok: true, errorType: null, message: "User registered" };

    } catch (error)
    {
        // Duplicate value (Email already exists)
        if (error.code = 23505)
        {
            return { ok: false, errorType: "duplicate", message: "Email already exists" };
        }

        return { ok: false, errorType: "unknown error", message: error };
    }
};


// Check if user exists (Email), and compare password (Authentication)
export async function checkUser(email, password) {
    const result = await db.query("SELECT * FROM USERS WHERE email = $1", [email]);

    if (result.rowCount <= 0) {
        return { ok: false, data: null, errorType: "email", message: "Email not found" };
    }
    else
    {
        // Compare input password with database password
        const isValid = await comparePasswords(password, result.rows[0].password);

        //Testing (Updating password)
        //const isValid = (password === result.rows[0].password) ? true : false;

        if (isValid)
        {
            return {ok: true, data: result.rows[0], errorType: null, message: null};
        } else {
            return {ok: false,  data: null, errorType: "password", message: "Incorrect Password"};
        }
    }
};

// Get user details (Full name and email)
export async function getDetails(email, password, userID) {
    try {
        const result = await db.query(`SELECT email, forename, surname FROM users WHERE email = $1 OR user_id = $2`, [email, userID]);

        if (result.rowCount <= 0) {
            return { ok: false, data: null, errorType: "email", message: "Email not found" };
        }
        else {
            return{ ok: true, data: result.rows[0], errorType: null, message: "User found" };
        }


    } catch (error){
        throw error;
    }
};

// Change user details (names, email, password) (Altering required) || (Testing)
export async function updateDetails(userID, newEmail, newForename, newSurname, newPassword)
{

    try {
        const result = await db.query(`SELECT user_id email, forename, surname, password FROM users WHERE user_id = $1`, [userID]);

        if (result.rowCount <= 0) {
            return { ok: false, data: null, errorType: "unknow", message: "Unknown error" };
        }

        let data = result.rows[0];

        data.email = newEmail;
        data.forename = newForename;
        data.surname = newSurname;

        // Only set new passwrod if its different to current and is not null
        if (newPassword)
        {
            data.password = await hashPassword(saltingRounds, newPassword);
        }

        const result1 = await db.query(`UPDATE users SET email = $1, forename = $2, surname = $3, password = $4 WHERE user_id = $5 RETURNING email, forename, surname`,
            [
                data.email,
                data.forename,
                data.surname,
                data.password,
                userID,
            ]);
        
        if (result.rowCount <= 0) {
            return { ok: false, data: null, errorType: "unknown", message: "Couldn't update user" };
        }
        
        return { ok: true, data: result1.rows[0], errorType: null, message: "User Updated" };

    } catch (error)
    {
        throw (error);
    }
}

// Delete user
export async function deleteUser(userID) {

    //Delete account flights (If available)
    try {
        // First, delete all user flights
        deleteAllFlights(userID);

        // Delete user
        const result = await db.query(`DELETE FROM users WHERE user_id = $1`, [userID])

        if (result.rowCount <= 0) {
            return { ok: false, errorType: "unknown", message: "Unknown error, couldn't delete account" };
        }

        return { ok: true, errorType: null, message: "Account Deleted" };
        
    } catch (error)
    {
        console.log(error);
    }

   
}

export async function TestGetData() {
    await db.query("SELECT * FROM users", null, (error, result) => {
        if (error)
        {
            console.log(error.message);    
            return;
        }

        console.log(result.rows[0]);
    })
}