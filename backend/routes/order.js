import express from "express";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";
import { createOrder, deleteOrder, getAllOrders, getSales, myOrderDetail, myOrders, updateOrderStatus } from "../controllers/orderControllers.js";

const router = express.Router();

router.route('/orders/new').post(isAuthenticatedUser, createOrder)
router.route('/me/orders').get(isAuthenticatedUser, myOrders)
router.route('/orders/:id').get(isAuthenticatedUser, myOrderDetail)

// Admin Routes
router.route('/admin/sales').get(isAuthenticatedUser, authorizeRoles('admin'), getSales)
router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles('admin'), getAllOrders)
router.route('/admin/orders/:id')
    .post(isAuthenticatedUser, authorizeRoles('admin'), updateOrderStatus)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder)

export default router