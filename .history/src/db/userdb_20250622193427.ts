import { MongoClient } from "mongodb";
import mongoose from "mongoose";
const vite_db = import.meta.env.VITE_DB;
const client = new MongoClient(vite_db);
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    phone: String,
    password: String, // hashed password
    photo: String,
    user_type: String, // "CUSTOMER" | "STAFF" | "ADMIN"
    login_time: Date,
});
export function StartServer(): Promise<MongoClient> {
    return client.connect();
}

export default client.db();
