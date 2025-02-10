import { Job,JobApply } from "../models/jobModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";
import mongoose from 'mongoose';
import { User } from "../models/userModel.js";
import cloudinary from '../config/cloudConfig.js';
import { v2 as cloudinaryV2 } from 'cloudinary';


export const createJob = async (req, res, next) => {
    try {
        const { title, details, company, skills, contact } = req.body;

        if (!title || !details || !company || !contact || !skills) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let image = req.file;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'uploads', 
            });
            image = result.secure_url; 
            // return res.status(201).json({ data: result, message: 'Job Created' });

        }

        const mentorID = req.mentor.id;

        // Create a new job entry
        const jobData = new Job({ mentorID, title, details, company, contact, skills, image });
        // await jobData.save();

        return res.status(201).json({ data: jobData, message: 'Job Created' });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};




export const updateJob = async (req, res, next) => {
    try {
        const { title, details, company, skills, contact } = req.body;
        const { jobId } = req.params;

        if (!jobId) {
            return res.status(400).json({ message: "Job ID is required" });
        }

        let image;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'uploads',
            });
            image = result.secure_url;
        }

        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            { title, details, company, skills, contact, ...(image && { image }) },
            { new: true } 
        );

        if (!updatedJob) {
            return res.status(404).json({ message: "Job not found" });
        }

        return res.status(200).json({ data: updatedJob, message: "Job Updated Successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
    }
};


export const getJobs = async (req, res, next) => {
    try {
        console.log("Fetching all jobs");

        // Fetch all jobs from the Job collection
        const jobs = await Job.find({ isVerified: true });
        
        return res.json({
            data: jobs,
            message: "Jobs fetched successfully",
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};



export const searchJobs = async (req, res, next) => {
    try {
        console.log("Searching all jobs");

        const  {name} = req.body;// name is 'accountant' and jobs saved eg:-'title:accountant

        const jobs = await Job.find({ title: name });

        return res.json({
            data: jobs,
            message:name+ "Jobs Search successfully",
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};


export const jobDetails = async (req, res, next) => {
    try {
        const jobID = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(jobID)) {
            return res.status(400).json({ message: "Invalid Job ID" });
        }
        // const jobData = await Job.findById(mongoose.Types.ObjectId(jobID));

        // console.log("jobID:", jobID, "Type of jobID:", typeof jobID);

        // console.log("Job Data without select:", jobData);

        
        try {
            const jobData = await Job.findById(jobID);
            console.log("Job Data11:", jobData);
        } catch (error) {
            console.error("Error fetching job data:", error);
        }


        // Validate ObjectId
        // if (!mongoose.Types.ObjectId.isValid(jobID)) {
        //     return res.status(400).json({ message: "Invalid Job ID" });
        // }

        // Find Job
        // const userData = await User.findById(userId).select("-password");

        // try {
        //     const jobData = await Job.findById(jobID);
        //     console.log("Job Data:", jobData); // Check if the result is null or valid
        // } catch (error) {
        //     console.error("Error fetching job data:", error); // Log the error to see details
        // }
        // const jobData = await Job.findById(jobID).select("-details");
        const jobData = await Job.findById(jobID);

        if (!jobData) {
            return res.status(404).json({ message: "Job not found" });
        }

        return res.json({
            data: jobData,
            message: "Job details fetched successfully",
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};




export const jobLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const jobExist = await Job.findOne({ email });

        if (!jobExist) {
            return res.status(404).json({ message: "Job does not exist" });
        }

        const passwordMatch = bcrypt.compareSync(password, jobExist.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Job not authenticated" });
        }

        const token = generateToken(jobExist._id); // Use jobExist._id instead of jobData._id
        res.cookie("token", token);

        return res.json({ data: jobExist, message: "Job login success" }); // Use jobExist instead of jobData
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};


export const jobProfile = async (req, res, next) => {
    try {
        const jobId = req.job.id;

        const jobData = await Job.findById(jobId).select("-password");
        return res.json({ data: jobData, message: "job profile fetched" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};


// controllers/testController.js
export const new_test = async (req, res, next) => {
    try {
        console.log('Request Body:', req.body); // Log the incoming body for debugging
        return res.json({
            message: 'Received POST data',
            data: req.body, // Return the POST data
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};



export const jobLogout = async (req, res, next) => {
    try {
        res.clearCookie("token");

        return res.json({ message: "job logout success" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};




export const profileUpdate = async (req, res, next) => {
    try {
        console.log("Profile update endpoint hit");

        const jobId = req.job.id; 
        const { name, email, mobile, profilePic } = req.body;

        if ( !mobile) {
            return res.status(400).json({ message: "Name and email are required" });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        if (name) job.name = name;
        if (email) job.email = email;
        if (mobile) job.mobile = mobile;
        if (profilePic) job.profilePic = profilePic;
       

        const updatedJob = await job.save();

        return res.json({
            data: updatedJob,
            message: "Profile updated successfully",
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};



export const accountDeactivate = async (req, res, next) => {
    try {
        const jobId = req.job.id;
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        job.isActive = false;
        const updatedJob = await job.save();

        return res.json({
            data: updatedJob,
            message: "Deactivated successfully",
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};




export const changePassword = async (req, res, next) => {
    try {
        console.log("Profile update endpoint hit");

        const jobId = req.job.id; 
        const {password } = req.body;

        if ( !password) {
            return res.status(400).json({ message: "New Password required" });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const jobData = new Job({ password: hashedPassword, });


        const updatedJob = await job.save();

        return res.json({
            data: updatedJob,
            message: "Password updated successfully",
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};



export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const job = await Job.findOne({ email });
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        job.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        job.resetPasswordExpire = Date.now() + 10 * 60 * 1000; 
        await job.save();

        const resetUrl = `${req.protocol}://${req.get("host")}/api/job/reset-password/${resetToken}`;

        return res.json({
            message: "Password reset link sent successfully",
            resetUrl,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};



export const applyForJob = async (req, res, next) => {
    try {

        const jobID = req.params.id;
        const userID = req.user.id;

        const user = await User.findById(userID).select("name");


        const jobApplyData = new JobApply({ userID,jobID });

         await jobApplyData.save();


        return res.json({ data: jobApplyData, message: user.name+ " Applied for Job" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};




export const verifyJob = async (req, res, next) => {
    try {
        const jobID = req.params.id;

        // Find the job by ID
        const jobData = await Job.findById(jobID);

        if (!jobData) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Update the `isVerified` field to true
        jobData.isVerified = true;

        // Save the updated job data
        const updatedJob = await jobData.save();

        return res.json({ data: updatedJob, message: "Job verified successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};



export const getApplications = async (req, res, next) => {
    try {
        console.log("Fetching all Apps");

        // Fetch all jobs from the Job collection

        
        const apps = await JobApply.find();

        for (let app of apps) {
            const userData = await User.findById(app.userID);
            const jobData = await Job.findById(app.jobID);
        
            app._doc.userData = userData; 
            app._doc.jobData = jobData;   
        }
        
    

        return res.json({
            data: apps,
            message: "Applications fetched successfully",
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

