import mongoose from "mongoose";

export const connectToDb = async() => {
    try {
        console.log("kya hua");
        await mongoose.connect(process.env.DB_URI.replace('<PASSWORD>',process.env.DB_PASSWORD))
        console.log('connected to database');
    } catch (error) {
        console.log(error);
    }
}