import mongoose from "mongoose";
import { boolean } from "zod";

type ConnectionObject = {
    isConnected? : number
}

const connection:ConnectionObject = {}

async function ConnectDB():Promise<void> {
    if(connection.isConnected){
       return console.log("Already connected to database");
        
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI || "" , {
            
        }) 

        connection.isConnected = db.connections[0].readyState
        // console.log(db);
        console.log(connection.isConnected);
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database connection failed",error);
        process.exit()
    }
}

export default ConnectDB