import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import User from "../models/user.js";

// Check if user is authenticated
export const isAuthenticatedUser = catchAsyncErrors( async (req,res,next) => {
    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandler("Please login first", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = await User.findById(decoded.id);

    next();
})

// Authorize user role
export const authorizeRoles = (...roles) => {
    
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler("Permission Denied", 403));
        }
        
        next();
    }
}