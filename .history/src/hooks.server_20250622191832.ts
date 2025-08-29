import { StartServer } from "./db/userdb";

StartServer().then(() => {
    console.log("Server Started");
});
