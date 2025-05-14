import mongoose from 'mongoose';

// Define the Product Collection
const productsCollection = 'productos';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnails: { type: [String], default: [] }
});

// Create a compound index for better query performance
productSchema.index({ code: 1 });

export const productModel = mongoose.model(productsCollection, productSchema); 