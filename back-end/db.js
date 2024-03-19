import "dotenv/config";
import pg from "pg";

const db = new pg.Client({
    user: process.env.USER,
    host: process.env.HSOT,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
});

export function connect() {
    db.connect();
};

export function disconnect() {
    db.disconnect();
};

/////////////////////////////////////////////////
//// Seperate User and flight database tables ///
/////////////////////////////////////////////////
// Register new user
export async function registerUser(forename, surname, email, password) {


    // Check if user exists

    await db.query(`INSERT INTO users (forename, surname, email, password) VALUES($1, $2, $3, $4)`, [forename, surname, email, password], (error, result) => {
        if (error)
        {
            console.log("Error", error.message);    
            // Determine what error to throw
            return false;
        }
    
        console.log("User Added", result);

    });
};

// Check if user exists (Email), and compare password (Authentication)
export async function checkUser(email, password) {
    const result = await db.query("SELECT * FROM USERS WHERE email = $1", [email]);

    if (result.rowCount <= 0) {
        return { ok: false, data: null, errorType: "email", message: "Email not found" };
    }
    else
    {
        // Compare passwords
        // Encrypt param password first
        if (result.rows[0].password === password)
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
        console.log(result.rows[0]);
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
export async function updateDetails(newEmail, newForename, newSurname, password, newPassword, userID)
{
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Check and get current data from database
    // If new parameters are not null, replace current details

    // Temp
    if (newEmail === null || newForename === null || newSurname === null || newPassword === null)
    {
        throw new Error("Details cannot be null");
    }
    
    // Removed password for testing
    // password = $4 //         newPassword,
    try {
        const result = await db.query(`UPDATE users SET email = $1, forename = $2, surname = $3 WHERE user_id = $4 RETURNING email, forename, surname`,
            [
                newEmail,
                newForename,
                newSurname,
                userID,
            ]);
        
        return result.rows[0];

    } catch (error)
    {
        throw error;
    }
}

// Delete user
export async function deleteUser(email, password) {
    await db.query(`DELETE FROM users WHERE email = $1`, [email], (error, result) => {
        if (error)
        {
            console.log(error.message);
            return;
        }    

        // Check Password
        
        console.log("User Deleted");
    });
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