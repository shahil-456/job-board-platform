import { Mentor } from "../models/mentorModel.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";
import mongoose from 'mongoose';
import { Job,JobApply,CvData } from "../models/jobModel.js";



export const mentorSignup = async (req, res, next) => {
    try {
        console.log("hitted");

        const { name, email, password, mobile, profilePic } = req.body;

        if (!name || !email || !password || !mobile) {
            return res.status(400).json({ message: "all fields are required"});
        }

        const isMentorExist = await Mentor.findOne({ email });

        if (isMentorExist) {
            return res.status(400).json({ message: "mentor already exist" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const mentorData = new Mentor({ name, email, password: hashedPassword, mobile, profilePic });
        await mentorData.save();

        const token = generateToken(mentorData._idm,'mentor');
        res.cookie("token", token);

        return res.json({ data: mentorData, message: "mentor account created" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const mentorLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const mentorExist = await Mentor.findOne({ email });

        if (!mentorExist) {
            return res.status(404).json({ message: "Mentor does not exist" });
        }

        const passwordMatch = bcrypt.compareSync(password, mentorExist.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Mentor not authenticated" });
        }

        const token = generateToken(mentorExist._id,'mentor'); // Use mentorExist._id instead of mentorData._id
        res.cookie("token", token);

        return res.json({ data: mentorExist, message: "Mentor login success" }); // Use mentorExist instead of mentorData
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};



export const accountDeactivate = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isActive = false;
        const updatedUser = await user.save();

        return res.json({
            data: updatedUser,
            message: "Deactivated successfully",
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};



export const mentorProfile = async (req, res, next) => {
    try {
        const mentorId = req.mentor.id;

        const mentorData = await Mentor.findById(mentorId).select("-password");
        return res.json({ data: mentorData, message: "mentor profile fetched" });
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



export const mentorLogout = async (req, res, next) => {
    try {
        res.clearCookie("token");

        return res.json({ message: "mentor logout success" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};




export const profileUpdate = async (req, res, next) => {
    try {
        console.log("Profile update endpoint hit");

        const mentorId = req.mentor.id; 
        const { name, email, mobile, profilePic } = req.body;

        if ( !mobile) {
            return res.status(400).json({ message: "Name and email are required" });
        }

        const mentor = await Mentor.findById(mentorId);
        if (!mentor) {
            return res.status(404).json({ message: "Mentor not found" });
        }

        if (name) mentor.name = name;
        if (email) mentor.email = email;
        if (mobile) mentor.mobile = mobile;
        if (profilePic) mentor.profilePic = profilePic;
       

        const updatedMentor = await mentor.save();

        return res.json({
            data: updatedMentor,
            message: "Profile updated successfully",
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};






export const changePassword = async (req, res, next) => {
    try {
        console.log("Profile update endpoint hit");

        const mentorId = req.mentor.id; 
        const {password } = req.body;

        if ( !password) {
            return res.status(400).json({ message: "New Password required" });
        }

        const mentor = await Mentor.findById(mentorId);
        if (!mentor) {
            return res.status(404).json({ message: "Mentor not found" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const mentorData = new Mentor({ password: hashedPassword, });


        const updatedMentor = await mentor.save();

        return res.json({
            data: updatedMentor,
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

        const mentor = await Mentor.findOne({ email });
        if (!mentor) {
            return res.status(404).json({ message: "Mentor not found" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        mentor.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        mentor.resetPasswordExpire = Date.now() + 10 * 60 * 1000; 
        await mentor.save();

        const resetUrl = `${req.protocol}://${req.get("host")}/api/mentor/reset-password/${resetToken}`;

        return res.json({
            message: "Password reset link sent successfully",
            resetUrl,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};




export const getAllUsers = async (req, res, next) => {
    try {
        console.log("Fetching all Users");

        // Fetch all jobs from the Job collection
        const Users = await User.find();

        return res.json({
            data: Users,
            message: "Users fetched successfully",
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};





export const userDetails = async (req, res, next) => {
    try {
        const userID = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userID)) {
            return res.status(400).json({ message: "Invalid Job ID" });
        }


        const userData = await User.findById(userID);
        
        const cvData = await CvData.findOne({ userID });

        if (cvData) {
            userData._doc.cv = cvData.cv;
            userData._doc.skill = cvData.skill;
        }
        


        console.log(userData);


        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({
            data: userData,
            message: "User details fetched successfully",
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};




export const checkMentor = async (req, res, next) => {
    try {
        return res.json({ message: "Employer autherized" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

