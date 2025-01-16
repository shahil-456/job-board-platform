import mongoose from 'mongoose';
export const connectDB = async () => {
        try {
        await mongoose.connect('mongodb+srv://shahilshadh037:<eh28YW4YAj9XVmsx>@cluster0.uztsd.mongodb.net/');
        console.log('connected');

    } catch (error) {
        console.log(error);
        
    }
};