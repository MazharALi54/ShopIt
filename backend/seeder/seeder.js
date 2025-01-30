import mongoose from "mongoose";
import products from "./data.js";
import Product from "../models/product.js";

const seedProducts = async ()=> {
    try {
        await mongoose.connect("mongodb+srv://alimazharsyed54:mazhar@shoptit.oan1n.mongodb.net/?retryWrites=true&w=majority&appName=shoptIT");

        await Product.deleteMany();
        console.log("Products deleted");

        await Product.insertMany(products);
        console.log("Products added");

        process.exit();
    } catch (error) {
        console.log(error);
        process.exit();
    }
}

seedProducts();