import { Admin } from "../models/adminModel.js";
import { User } from "../models/userModel.js";

import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";

export const adminSignup = async (req, res, next) => {
    try {
        console.log("hitted");

        const { name, email, password, profilePic } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "all fields are required" });
        }

        const isAdminExist = await Admin.findOne({ email });

        if (isAdminExist) {
            return res.status(400).json({ message: "admin already exist" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const adminData = new Admin({ name, email, password: hashedPassword, profilePic });
        await adminData.save();

        const token = generateToken(adminData._id,'admin');
        res.cookie("token", token);

        return res.json({ data: adminData, message: "admin account created" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const adminExist = await Admin.findOne({ email });

        if (!adminExist) {
            return res.status(404).json({ message: "Admin does not exist" });
        }

        const passwordMatch = bcrypt.compareSync(password, adminExist.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Admin not authenticated" });
        }

        const token = generateToken(adminExist._id); // Use adminExist._id instead of adminData._id
        res.cookie("token", token);

        return res.json({ data: adminExist, message: "Admin login success" }); // Use adminExist instead of adminData
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};


export const adminProfile = async (req, res, next) => {
    try {
        const adminId = req.admin.id;

        const adminData = await Admin.findById(adminId).select("-password");
        return res.json({ data: adminData, message: "admin profile fetched" });
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





export const adminLogout = async (req, res, next) => {
    try {
        res.clearCookie("token");

        return res.json({ message: "admin logout success" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};






export const profileUpdate = async (req, res, next) => {
    try {
        console.log("Profile update endpoint hit");

        const adminId = req.admin.id; 
        const { name, email, mobile, profilePic } = req.body;

        if ( !mobile) {
            return res.status(400).json({ message: "Name and email are required" });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        if (name) admin.name = name;
        if (email) admin.email = email;
        if (mobile) admin.mobile = mobile;
        if (profilePic) admin.profilePic = profilePic;
       

        const updatedAdmin = await admin.save();

        return res.json({
            data: updatedAdmin,
            message: "Profile updated successfully",
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

        try {
            const jobData = await Job.findById(userID);
            console.log("User Data:", jobData);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }


        const jobData = await User.findById(userID);

        if (!jobData) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({
            data: jobData,
            message: "User details fetched successfully",
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

        const adminId = req.admin.id; 
        const {password } = req.body;

        if ( !password) {
            return res.status(400).json({ message: "New Password required" });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const adminData = new Admin({ password: hashedPassword, });


        const updatedAdmin = await admin.save();

        return res.json({
            data: updatedAdmin,
            message: "Password updated successfully",
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};



export const verifyUser = async (req, res, next) => {
    try {
        const UserId = req.params.id;

        // Find the job by ID
        const UserData = await User.findById(UserId);

        if (!UserData) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the `isVerified` field to true
        UserData.isVerified = true;

        // Save the updated job data
        const updatedJob = await UserData.save();

        return res.json({ data: updatedJob, message: "User verified successfully" });
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

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        admin.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        admin.resetPasswordExpire = Date.now() + 10 * 60 * 1000; 
        await admin.save();

        const resetUrl = `${req.protocol}://${req.get("host")}/api/admin/reset-password/${resetToken}`;

        return res.json({
            message: "Password reset link sent successfully",
            resetUrl,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};
