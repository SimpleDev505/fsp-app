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
const UserSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    photo: { type: String },
    user_type: {
        type: String,
        enum: ["CUSTOMER", "STAFF", "ADMIN"],
        required: true,
    },
    login_time: { type: Date, default: Date.now },
});

export const UserModel: Model<IUser> = mongoose.models.User ||
    mongoose.model<IUser>("User", UserSchema);
const UserModel = mongoose.models["User"] ?? mongoose.model("User", UserSchema);
export default client.db();
export default UserModel;
