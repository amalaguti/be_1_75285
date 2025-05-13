import mongoose from 'mongoose';

// Define the Product Collection
const productsCollection = 'productos';

// Define the Product Schema
const productSchema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    category: String,
    thumbnails: [String]
});

export const productModel = mongoose.model(productsCollection, productSchema);
