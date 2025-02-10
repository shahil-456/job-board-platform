import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema({
    mentorID: {
        type: String,
        maxLength: 100,
    },
    title: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30,
    },
    company: {
        type: String,
        required: true,
        minLength: 5,
    },
    skills: {
        type: String,
        required: true,
    },
   
    contact: {
        type: String,
    },
    details: {
        type: String,
        // required:tr
    },

    image: {
        type: String,

        // required:tr
    },
  
    role: {
        type: String,
        enum: ["mentor", "job"],
        default: "job",
    },

    isActive: {
        type: Boolean,
        default: true,
    },

    isVerified: { type: Boolean, default: false }
});


const jobApplyData = new Schema({
    userID: {
        type: String,
    },
   
    jobID: {
        type: String,
    },
  
    role: {
        type: String,
        enum: ["mentor", "job"],
        default: "job",
    },

   
});


const cvData = new Schema({
    userID: {
        type: String,
    },
   
    skill: {
        type: String,
    },

    cv: {
        type: String,
    },
  
    role: {
        type: String,
        enum: ["user", "job"],
        default: "user",
    },

   
});
export const CvData = mongoose.model("cvData", cvData);

export const Job = mongoose.model("Job", jobSchema);
export const JobApply = mongoose.model("JobApp", jobApplyData);
