import { MongoClient } from "mongodb";
const vite_db = import.meta.env.VITE_DB;
const client = new MongoClient(VITE_DB);

export function StartServer(): Promise<MongoClient> {
    return client.connect();
}

export default client.db();
