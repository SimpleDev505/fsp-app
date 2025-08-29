import { MongoClient } from "mongodb";
import { VITE_DB } from "$env/static/private";

const client = new MongoClient(VITE_DB);

export function FetchLogin() {
    return client.connect();
}
