import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";

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

        const token = generateToken(userData._id);
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

        const token = generateToken(userExist._id); // Use userExist._id instead of userData._id
        res.cookie("token", token);

        return res.json({ data: userExist, message: "User login success" }); // Use userExist instead of userData
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






export const profileUpdate = async (req, res, next) => {
    try {
        console.log("Profile update endpoint hit");

        const userId = req.user.id; 
        const { name, email, mobile, profilePic } = req.body;

        if ( !mobile) {
            return res.status(400).json({ message: "Name and email are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (mobile) user.mobile = mobile;
        if (profilePic) user.profilePic = profilePic;
       

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
