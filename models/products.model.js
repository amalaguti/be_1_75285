import mongoose from 'mongoose';

// Define the Product Collection
const productsCollection = 'productos';

// Define the Product Schema
const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnails: {
        type: [String],
        default: []
    }
});

// Create index for code field which serves as a business identifier
//productSchema.index({ code: 1 });

// Transform for JSON representation
productSchema.set('toJSON', {
    transform: function(doc, ret) {
        ret.mongoId = ret._id; // Rename _id to mongoId for clarity
        return ret;
    }
});

// Check if model exists before creating a new one
export const productModel = mongoose.models[productsCollection] || mongoose.model(productsCollection, productSchema); 