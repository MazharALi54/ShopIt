import Product from "../models/product.js"
import Order from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js"
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { upload_file, delete_file } from "../utils/cloudinary.js"
import APIFilters from "../utils/apiFilters.js";

//Get all products
export const getProducts = catchAsyncErrors(async (req, res) => {
    const resPerPage = 4;
    const apiFilters = new APIFilters(Product.find(), req.query).search().filters();

    let products = await apiFilters.query;
    let filteredProductsCount = products.length;

    apiFilters.pagination(resPerPage);
    products = await apiFilters.query.clone();

    res.status(200).json({
        resPerPage,
        filteredProductsCount,
        products,
    });
});

//Get Admin products
export const getAdminProducts = catchAsyncErrors(async (req, res) => {
    const products = await Product.find();

    res.status(200).json({
        products,
    });
});

// Product detail
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req?.params?.id).populate("reviews.user");

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    res.status(200).json({
        product,
    });
});



//create new product
export const newProduct = catchAsyncErrors(async (req, res) => {

    req.body.user = req.user._id;
    const product = await Product.create(req.body);

    res.status(200).json({
        product,
    });
});

// Update product
export const updateProduct = catchAsyncErrors(async (req, res) => {
    let product = await Product.findById(req?.params?.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    product = await Product.findByIdAndUpdate(req?.params?.id, req.body, { new: true })

    res.status(200).json({
        product,
    });
});

// Upload product images
export const uploadProductImages = catchAsyncErrors(async (req, res) => {
    let product = await Product.findById(req?.params?.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const uploader = async (image) => upload_file(image, "dv8rxuxpl/products")

    const urls = await Promise.all((req?.body?.images).map(uploader))

    product?.images?.push(...urls);

    await product?.save()

    res.status(200).json({
        product,
    });
});

// Delete product image
export const deleteProductImage = catchAsyncErrors(async (req, res) => {
    let product = await Product.findById(req?.params?.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const isDeleted = await delete_file(req.body.imgId);

    if (isDeleted) {
        product.images = product?.images?.filter(
            (img) => img.public_id !== req.body.imgId
        );

        await product?.save();
    }

    res.status(200).json({
        product,
    });
});

// Delete product
export const deleteProduct = catchAsyncErrors(async (req, res) => {
    let product = await Product.findById(req?.params?.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    product = await Product.deleteOne()

    res.status(200).json({
        message: "Product deleted",
    });
});

// Can user review
export const canUserReview = catchAsyncErrors(async (req, res) => {
    const orders = await Order.find({
        user: req.user._id,
        "orderItems.product": req.query.productId,
    });

    if (orders.length === 0) {
        return res.status(200).json({ canReview: false });
    }

    res.status(200).json({
        canReview: true,
    });
});

// Create/Update Review
export const createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req?.user?._id,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const isReviewed = product?.reviews?.find(
        (r) => r.user.toString() === req?.user?._id.toString()
    );

    if (isReviewed) {
        product.reviews.forEach((review) => {
            if (review?.user?.toString() === req?.user?._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    product.ratings =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});

//Get product reviews
export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id).populate("reviews.user");

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        reviews: product.reviews,
    });
});

// Delete product review
export const deleteReview = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    console.log(product)

    const reviews = product?.reviews?.filter(
        (review) => review?._id?.toString() !== req?.query?.id.toString()
    );

    const numOfReviews = reviews.length;

    const ratings =
        numOfReviews === 0
            ? 0
            : product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            numOfReviews;

    product = await Product.findByIdAndUpdate(
        req.query.productId,
        { reviews, numOfReviews, ratings },
        { new: true }
    );

    res.status(200).json({
        success: true,
        product,
    });
});