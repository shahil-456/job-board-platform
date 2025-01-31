import mongoose, { Schema } from "mongoose";

const mentorSchema = new Schema({
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
    mobile: {
        type: String,
        required: true,
    },
    profiePic: {
        type: String,
        default: "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg",
    },
    qualification: {
        type: String,
    },
    exeperience: {
        type: String,
        // required:tr
    },
    role: {
        type: String,
        enum: ["admin", "mentor"],
        default: "mentor",
    },

    isActive: {
        type: Boolean,
        default: true,
    },
    isVerified: { type: Boolean, default: false },

});

export const Mentor = mongoose.model("Mentor", mentorSchema);
