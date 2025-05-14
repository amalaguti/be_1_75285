import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: [{
        product: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'productos',
            required: true 
        },
        quantity: { type: Number, required: true, default: 1 }
    }],
    createdAt: { type: Date, default: Date.now }
});

export const cartModel = mongoose.model('Cart', cartSchema); 