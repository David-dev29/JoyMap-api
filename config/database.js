import mongoose from "mongoose";

let url = process.env.URI_MONGO

console.log(url);

async function conectDB() {
    try {
        await mongoose.connect(url);
        console.log("Database connected");   
    } catch (error) {
        console.log(error);
        
    }

}

conectDB()