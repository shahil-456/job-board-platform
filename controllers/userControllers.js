import { User } from "../models/userModel.js";

import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";
import cloudinary from '../config/cloudConfig.js';
import { v2 as cloudinaryV2 } from 'cloudinary';
import { Job,JobApply,CvData } from "../models/jobModel.js";


export const userSignup = async (req, res, next) => {
    try {
        console.log("hitted");

        const { name, email, password, mobile, profilePic } = req.body;

        if (!name || !email || !password || !mobile) {
            return res.status(400).json({ message: "all fields are required" });
        }

        const isUserExist = await User.findOne({ email });

        if (isUserExist) {
            return res.status(400).json({ message: "user already exist" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const userData = new User({ name, email, password: hashedPassword, mobile, profilePic });
        await userData.save();

        const token = generateToken(userData._id,'user');
        res.cookie("token", token);

        return res.json({ data: userData, message: "user account created" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(404).json({ message: "User does not exist" });
        }
        const passwordMatch = bcrypt.compareSync(password, userExist.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const token = generateToken(userExist._id,'user'); // Use userExist._id instead of userData._id
        res.cookie("token", token);
        return res.json({ data: userExist, message: "Success",token:token}); // Use userExist instead of userData
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};


export const userProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const userData = await User.findById(userId).select("-password");
        return res.json({ data: userData, message: "user profile fetched" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};


export const myCV = async (req, res) => {
    try {
        const userID = req.user.id; // Get user ID from authenticated request

        // Fetch CV data for the user
        const userData = await CvData.findOne({ userID });

        // If no CV found, return error message
        if (!userData) {
            return res.status(404).json({ message: "CV not found for this user." });
        }

        return res.json({ data: userData, message: "CV fetched successfully" });

    } catch (error) {
        console.error("Error fetching CV:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



export const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, 'd1s24fhjkd8723jh89dsjkfhweuir2jhewr832ur');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid token' });
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





export const userLogout = async (req, res, next) => {
    try {
        res.clearCookie("token");

        return res.json({ message: "user logout success" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};



export const checkUser = async (req, res, next) => {
    try {
        return res.json({ message: "user autherized" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};








export const profileUpdate = async (req, res, next) => {
    try {
        console.log("Profile update endpoint hit");

        const userId = req.user.id; 
        const { name, email, mobile } = req.body;


        let profPic = req.file;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'uploads', 
            });
            profPic = result.secure_url; 
            // return res.status(201).json({ data: result, message: 'Job Created' });

        }


        // if ( !mobile) {
        //     return res.status(400).json({ message: "Name and email are required" });
        // }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        if (name) user.name = name;
        if (email) user.email = email;
        if (mobile) user.mobile = mobile;
        if (profPic) user.profilePic = profPic;

       
        const updatedUser = await user.save();

        return res.json({
            data: updatedUser,
            message: "Profile updated successfully",
        });
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




export const changePassword = async (req, res, next) => {
    try {
        console.log("Profile update endpoint hit");

        const userId = req.user.id; 
        const {password } = req.body;

        if ( !password) {
            return res.status(400).json({ message: "New Password required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const userData = new User({ password: hashedPassword, });


        const updatedUser = await user.save();

        return res.json({
            data: updatedUser,
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

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; 
        await user.save();

        const resetUrl = `${req.protocol}://${req.get("host")}/api/user/reset-password/${resetToken}`;

        return res.json({
            message: "Password reset link sent successfully",
            resetUrl,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};




export const uploadCV = async (req, res, next) => {
    try {

        const { skill } = req.body;

        let cv = req.file;//upload this file to cloudinary
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'uploads', 
            });
            cv = result.secure_url; 
            // return res.status(201).json({ data: result, message: 'CV Uploaded' });

        }

        const userID = req.user.id;
        // Create a new job entry
        const cvData = new CvData({ userID,skill,cv });
        await cvData.save();
        return res.status(201).json({ data: cvData, message: 'CV Added' });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

