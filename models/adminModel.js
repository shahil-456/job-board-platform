import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 30,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    
    profiePic: {
        type: String,
        default: "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-admin-profile-icon.jpg",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});

export const Admin = mongoose.model("Admin", adminSchema);
