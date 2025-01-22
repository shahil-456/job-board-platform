import jwt from "jsonwebtoken";

export const mentorAuth = (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "user not autherised", success: false });
        }

        const tokenVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        if (!tokenVerified) {
            return res.status(401).json({ message: "user not autherised", success: false });
        }
        
        if(tokenVerified.role != 'mentor' && tokenVerified.role !='admin'){
            return res.status(401).json({ message: "user not autherised", success: false });
        }

        req.user = tokenVerified;

        next();
    } catch (error) {
        return res.status(401).json({ message: error.message || "user autherization failed", success: false });
    }
};