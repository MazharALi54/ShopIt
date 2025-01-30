import ErrorHandler from "../utils/errorHandler.js";

export default (err, req, res, next) => {
    let error = {
        statusCode: err?.statusCode || 500,
        message: err?.message || "Internal Server Error"
    };

    //Handle Invalid Mongoose ID Eror
    if(err.name === 'CastError'){
        const message = `Resource not found. Invalid: ${err?.path}`;
        error = new ErrorHandler(message, 404);
    }

    //Handle validation error
    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map((value) => value.message);
        error = new ErrorHandler(message, 400);
    }

    res.status(error.statusCode).json({
        message: error.message,
        error: err,
        stack: err?.stack,
    })
}