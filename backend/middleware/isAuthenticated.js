import jwt from "jsonwebtoken"; // FIXED: Import the main jwt object
import { User } from "../model/userModel.js"; // Ensure file extension if using ES modules
import 'dotenv/config';

export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ // Changed to 401 Unauthorized
        success: false,
        message: "Authorization token is missing or invalid"
      });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    
    try {
      // FIXED: Use jwt.verify instead of JsonWebTokenError.verify
      decoded = jwt.verify(token, process.env.SECRET_KEY || process.env.SECRETE_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ // Changed to 401 Unauthorized
          success: false,
          message: "The registration token has expired"
        });
      }
      return res.status(401).json({
        success: false,
        message: "Token verification failed"
      });
    }

    // Lookup user using ID extracted from token payload
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    req.user=user

    // Attach user ID to the request object for downstream routes
    req.id = user._id.toString(); 
    // userId=req.id;
    next();
   
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const isAdmin=async(req,res,next)=>{
  if(req.user && req.user.role==="admin"){
    next()
  }else{
    return res.status(400).json({
      message:"access denied :admin only"
    })
  }
}