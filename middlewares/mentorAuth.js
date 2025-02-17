import jwt from "jsonwebtoken";

export const mentorAuth = (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "employer not autherised", success: false });
        }

        const tokenVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        if (!tokenVerified) {
            return res.status(401).json({ message: "employer not autherised", success: false });
        }
        
        if(tokenVerified.role != 'mentor'){
            return res.status(401).json({ message: "employer not autherised3", success: false });
        }

        req.mentor = tokenVerified;

        next();
    } catch (error) {
        return res.status(401).json({ message: error.message || "employer autherization failed", success: false });
    }
};