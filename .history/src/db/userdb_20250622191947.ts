import { MongoClient } from "mongodb";
const vite_db = import.meta.env.VITE_DB;
const client = new MongoClient(vite_db);

export function StartServer(): Promise<MongoClient> {
    return client.connect();
}

export default client.db();
