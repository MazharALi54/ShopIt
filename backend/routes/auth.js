import express from "express";
import { register, login, logout, getUserProfile, updatePassword, updateProfile, getAllUsers, getUserDetails, updateUserProfile, deleteUser, uploadAvatar } from "../controllers/authControllers.js";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile").get(isAuthenticatedUser, getUserProfile);
router.route("/upload-avatar").put(isAuthenticatedUser, uploadAvatar);
router.route("/update-profile").put(isAuthenticatedUser, updateProfile);
router.route("/update-password").put(isAuthenticatedUser, updatePassword);

// Admin Routes
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router.route("/admin/users/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserProfile)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser)

export default router;