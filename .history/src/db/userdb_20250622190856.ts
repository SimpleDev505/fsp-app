import { MongoClient } from "mongodb";
import { VITE_DB } from "$env/static/private";

const client = new MongoClient();
