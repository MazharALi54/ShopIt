import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js"
import Order from "../models/order.js";
import Product from "../models/product.js";

// Create Order
export const createOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentMethod,
        paymentInfo,
        itemsPrice,
        taxAmount,
        totalAmount,
        shippingAmount,
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentMethod,
        paymentInfo,
        itemsPrice,
        taxAmount,
        totalAmount,
        shippingAmount,
        user: req.user._id
    });

    res.status(200).json({
        order,
    })

});

//Get all orders of single user
export const myOrders = catchAsyncErrors(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        orders,
    });
});

// Order detail
export const myOrderDetail = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req?.params?.id).populate("user", "name email");

    if (!order) {
        return next(new ErrorHandler("Order not found with this id", 404));
    }
    res.status(200).json({
        order,
    });
});

// Admin controllers
// Get all orders
export const getAllOrders = catchAsyncErrors(async (req, res) => {
    const orders = await Order.find();

    res.status(200).json({
        orders,
    });
});

// Update Order Status
export const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req?.params?.id);

    if (!order) {
        return next(new ErrorHandler("Order not found with this id", 404));
    }
    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("Order already delivered", 400));
    }

    //Update product quantity
    order?.orderItems?.forEach(async (item) => {
        const product = await Product.findById(item?.product?.toString());

        if (!product) {
            return next(new ErrorHandler("Product not found with this id", 404));
        }
        product.stock = product.stock - item.quantity;
        await product.save({ validateBeforeSave: false });
    });

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();
    await order.save();

    res.status(200).json({
        success: true,
    });
});

// Delete Order
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req?.params?.id);

    if (!order) {
        return next(new ErrorHandler("Order not found with this id", 404));
    }

    await order.deleteOne();

    res.status(200).json({
        success: true,
    });
});

//Get Sales data
export const getSales = catchAsyncErrors(async (req, res) => {

    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    const orders = await Order.find({
        createdAt: {
            $gte: startDate,
            $lte: endDate,
        },
    });

    const totalSales = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    // Aggregate data for the chart
    const salesData = {};
    orders.forEach((order) => {
        const date = order.createdAt.toISOString().split('T')[0]; // Get YYYY-MM-DD
        if (!salesData[date]) {
            salesData[date] = { sales: 0, numOrders: 0 };
        }
        salesData[date].sales += order.totalAmount;
        salesData[date].numOrders += 1;
    });

    // Convert to array format
    const sales = Object.entries(salesData).map(([date, { sales, numOrders }]) => ({
        date,
        sales,
        numOrders,
    }));

    res.status(200).json({
        totalSales,
        totalOrders: orders.length,
        sales,
    });
});