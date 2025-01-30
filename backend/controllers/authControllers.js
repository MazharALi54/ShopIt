import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js"
import User from "../models/user.js";
import sendToken from "../utils/sendToken.js";
import { delete_file, upload_file } from "../utils/cloudinary.js";

// Register User
export const register = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password
    });

    sendToken(user, 201, res)
});

// Login User
export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next("Please enter email and password", 400)
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    const correctPassword = await user.comparePassword(password);

    if (!correctPassword) {
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    sendToken(user, 200, res)
});

// Logout User
export const logout = catchAsyncErrors(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httplOnly: true,
    });

    res.status(200).json({
        message: "Logged Out",
    })
});

// User Profile
export const getUserProfile = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req?.user?._id);

    res.status(200).json({
        user,
    });
});

// Update password
export const updatePassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req?.user?._id).select("+password");

    //check previous password
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }

    user.password = req.body.password;
    user.save();

    res.status(200).json({
        success: true,
    });
});

// Update Profile
export const updateProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
        new: true,
    });

    res.status(200).json({
        user,
    });
});

// Upload avatar
export const uploadAvatar = catchAsyncErrors(async (req, res, next) => {
    const { avatar } = req.body;

    if (!avatar) {
        return next(new ErrorHandler("No avatar provided", 400));
    }
    const avatarResponse = await upload_file(req.body.avatar, "ECommerceShop/avatars");

    // Remove previous avatar
    if (req?.user?.avatar?.url) {
        await delete_file(req?.user?.avatar?.public_id);
    }

    const user = await User.findByIdAndUpdate(req?.user?._id, {
        avatar: avatarResponse,
    });

    res.status(200).json({
        user,
    });
});

//Admin Routes
// Get all users
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {

    const users = await User.find();

    if (!users) {
        return next(new ErrorHandler("No users found", 404));
    }

    res.status(200).json({
        users,
    });
});

// Get User details
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
        user,
    });
});

// Update Profile
export const updateUserProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
    });

    res.status(200).json({
        user,
    });
});

// Delete User
export const deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user._id);

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    //Remove user avatar from cloudinary
    if(user?.avatar?.public_id){
        await delete_file(user?.avatar?.public_id)
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
    });
});