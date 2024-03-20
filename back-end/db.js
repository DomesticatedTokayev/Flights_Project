import "dotenv/config";
import pg from "pg";

export const db = new pg.Client({
    user: process.env.USER,
    host: process.env.HSOT,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
});

export function connectDB() {
    db.connect();
};

export function disconnectDB() {
    db.disconnect();
};