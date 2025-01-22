import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.uri);
        console.log('database connected-----');
        
    } catch (error) {
        console.log(error);
    }
};
