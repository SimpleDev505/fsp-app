import { MongoClient } from "mongodb";

const client = new MongoClient(VITE_DB);

export function StartServer(): Promise<MongoClient> {
    return client.connect();
}

export default client.db();
