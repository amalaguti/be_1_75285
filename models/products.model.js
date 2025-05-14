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

// Create index for code field which serves as a business identifier
productSchema.index({ code: 1 });

// Transform for JSON representation
productSchema.set('toJSON', {
    transform: function(doc, ret) {
        ret.mongoId = ret._id; // Rename _id to mongoId for clarity
        return ret;
    }
});

export const productModel = mongoose.model(productsCollection, productSchema); 