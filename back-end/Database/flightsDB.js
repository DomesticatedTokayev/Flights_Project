import { db } from "./db.js";

// Get all flights
export async function getAllFlights(userID) {
    try {
        const result = await db.query(`SELECT * FROM flights WHERE user_id = $1 ORDER BY date_created DESC`, [userID]);

        if (result.rowCount <= 0) {
            return { ok: false, data: null, errorCode: "flight count", message: "No flights found" };
        }

        return { ok: true, data: result.rows, errorCode: null, message: "Flights found" };

    } catch (error)
    {
        throw error;
    }
};

// Get flight
export async function getFlightByID(userID, flightID)
{
    try {
        const result = await db.query("SELECT * FROM flights WHERE user_id = $1 AND id = $2", [userID, flightID]);

        if (result.rowCount <= 0) {
            return { ok: false, data: null, errorCode: "empty", message: "Flight not found" };
        }

        return { ok: true, data:result.rows[0], errorCode: null, message: "Flight found" };
        
    } catch (error)
    {
        throw (error);
    }
};

// Add new flight
export async function add(userID, origin_country, origin_city, destination_country, destination_city, outbound_from, outbound_to, max_price, with_return, min_stay, max_stay)
{
    const dateCreated = new Date().toUTCString();
    
    // console.log(userID,
    //     origin_country,
    //     origin_city,
    //     destination_country, 
    //     destination_city, 
    //     outbound_from, 
    //     outbound_to,
    //     max_price, 
    //     with_return, 
    //     min_stay,
    //     max_stay);
    
    
    
    try {
        // Check if entry already exists
        // const exists = await db.query(`SELECT 1 FROM flights WHERE 

        // user_id = ${userID} AND
        // origin_country = '${origin_country}' AND
        // origin_city = '${origin_city}' OR origin_city IS NULL AND
        // outbound_from = '${outbound_from}' AND
        // outbound_to = '${outbound_to}'


        // LIMIT 1`
        // );

        //  Backups Below

        /*
        origin_country = '${origin_country}' AND
        origin_city = '${origin_city}' AND
        destination_country = '${destination_country}' AND
        destination_city = '${destination_city}' 

        AND
        outbound_from = ${outbound_from} AND
        outbound_to = ${outbound_to} AND
        max_price = ${max_price} AND
        with_return = ${with_return}  AND
        min_stay = ${min_stay}  AND
        max_stay = ${max_stay}
        */

        // const exists = await db.query(`SELECT 1 FROM flights WHERE 
        // user_id = ${userID} AND
        // origin_country = ${origin_country} AND
        // origin_city = ${origin_city} AND
        // destination_country = ${destination_country} AND
        // destination_city = ${destination_city} AND
        // outbound_from = ${outbound_from} AND
        // outbound_to = ${outbound_to} AND
        // max_price = ${max_price} AND
        // with_return = ${with_return} AND
        // min_stay = ${min_stay} AND
        // max_stay = ${max_stay}
        // LIMIT 1`
        // );

        // , [
        //     userID,
        //     origin_country,
        //     origin_city,
        //     destination_country, 
        //     destination_city, 
        //     outbound_from, 
        //     outbound_to,
        //     max_price, 
        //     with_return, 
        //     min_stay,
        //     max_stay]
        
        // const exists = await db.query(`SELECT 1 FROM flights WHERE 
        // user_id = $1 AND
        // origin_country = $2 AND

        // destination_country = $3 AND
        // outbound_from = $4 AND
        // outbound_to = $5 AND
        // with_return = $6 AND 
        // origin_city = $7

   
        // LIMIT 1`, [
        //     userID,
        //     origin_country,
        //     origin_city,
        //     destination_country, 
        //     destination_city, 
        //     outbound_from, 
        //     outbound_to,
        //     max_price, 
        //     with_return, 
        //     min_stay,
        //     max_stay]
        // );

        const result = await db.query(`INSERT INTO flights (
            user_id,
            origin_country,
            origin_city,
            destination_country,
            destination_city,
            outbound_from, 
            outbound_to, 
            max_price, 
            with_return, 
            min_stay, 
            max_Stay,
            date_created)
            VALUES( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
            [
                userID,
                origin_country,
                origin_city,
                destination_country,
                destination_city,
                outbound_from,
                outbound_to,
                max_price,
                with_return,
                min_stay,
                max_stay,
                dateCreated,
            ]);
        
        if (result.rowCount <= 0)
        {
            return { ok: false, errorCode: "add", message: "Couldn't add flight to database" };    
        }

         return { ok: true, errorCode: null, message: "Flight added to database" };    

    } catch (error) {
        throw (error);
    }
};

export async function deleteFlightByID(userID, flightID)
{
    try {
        const result = await db.query(`DELETE FROM flights WHERE user_id = $1 AND id = $2`, [userID, flightID]);

        if (result.rowCount <= 0)
        {
            return { ok: false, errorCode: "unknown", message: "Couldn't delete entry" };
        }

        return { ok: true, errorCode: null, message: "Flight Deleted" };

    } catch (error)
    {
        throw (error);
    }
}

export async function deleteAllFlights(userID) {
    try {
        const result = await db.query(`DELETE FROM flights WHERE user_id = $1`, [userID]);
    } catch (error)
    {
        throw (error);
    }
}

// Update flight
export async function update(userID, flightID, origin_country, origin_city, destination_country, destination_city, outbound_from, outbound_to, max_price, with_return, min_stay, max_stay)
{
    const dateCreated = new Date().toUTCString();

    try {
        const result = await db.query(`UPDATE flights 
        SET 
        origin_country = $3,
        origin_city = $4,
        destination_country = $5,
        destination_city = $6,
        outbound_from = $7,
        outbound_to = $8,
        max_price = $9,
        with_return = $10,
        min_stay = $11,
        max_stay = $12, 
        date_created = $13
        WHERE user_id = $1 AND id = $2`
        , [
            userID,
            flightID,
            origin_country,
            origin_city,
            destination_country,
            destination_city,
            outbound_from,
            outbound_to,
            max_price,
            with_return,
            min_stay,
            max_stay,
            dateCreated
            ]);

        if (result.rowCount <= 0)
        {
            return {ok: false, errorCode: "update", message: "Couldn't update flight"}    
        }

        return { ok: true, errorCode: null, message: "Flight updated" };

    } catch (error)
    {
        throw (error);
    }
};

// Delete flight


export function formatFlight(id, origin_country, origin_city, destination_country, destination_city, outbound_from, outbound_to, max_price, with_return, min_stay, max_stay)
{
    let from = new Date(outbound_from);
    let to = new Date(outbound_to);

    from = `${from.getFullYear()}-${(from.getMonth() + 1).toString().padStart(2, '0')}-${from.getDate().toString().padStart(2, '0')}`;
    to = `${to.getFullYear()}-${(to.getMonth() + 1).toString().padStart(2, '0')}-${to.getDate().toString().padStart(2, '0')}`;

    const flight = {
        id: id,
        originCountry: origin_country,
        originCity: origin_city,
        destinationCountry: destination_country,
        destinationCity: destination_city,
        from: from,
        to: to,
        maxPrice: max_price,
        return: with_return,
        minStay: min_stay,
        maxStay: max_stay,
    };

    return flight;
};