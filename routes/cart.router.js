import express from 'express';
import { cartModel } from '../models/cart.model.js';
import { productModel } from '../models/products.model.js';

const router = express.Router();

// Get cart or create if doesn't exist
router.get('/', async (req, res) => {
    try {
        // For now, we'll work with a single cart. In a real app, this would be tied to a user session
        let cart = await cartModel.findOne({}).populate('products.product').lean();
        
        if (!cart) {
            cart = await cartModel.create({ products: [] });
            cart = await cart.populate('products.product');
        }

        res.render('cart', {
            title: 'Shopping Cart',
            cart: cart
        });
    } catch (error) {
        console.error('Error retrieving cart:', error);
        res.status(500).json({ error: 'Error retrieving cart' });
    }
});

// Add product to cart
router.post('/add/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await productModel.findById(productId);
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        let cart = await cartModel.findOne({});
        
        if (!cart) {
            cart = await cartModel.create({ products: [] });
        }

        // Check if product already exists in cart
        const existingProduct = cart.products.find(item => 
            item.product.toString() === productId
        );

        if (existingProduct) {
            // Check if adding one more exceeds stock
            if (existingProduct.quantity + 1 > product.stock) {
                return res.status(400).json({ 
                    error: `Cannot add more items. Only ${product.stock} available in stock.`
                });
            }
            existingProduct.quantity += 1;
        } else {
            // Check if product has stock available
            if (product.stock < 1) {
                return res.status(400).json({ 
                    error: 'Product is out of stock'
                });
            }
            cart.products.push({ product: productId, quantity: 1 });
        }

        await cart.save();
        res.redirect('/api/carts');
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Error adding to cart' });
    }
});

// Remove product from cart
router.delete('/remove/:productId', async (req, res) => {
    try {
        const cart = await cartModel.findOne({});
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        cart.products = cart.products.filter(item => 
            item.product.toString() !== req.params.productId
        );

        await cart.save();
        res.json({ message: 'Product removed from cart' });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ error: 'Error removing from cart' });
    }
});

// Update product quantity
router.put('/update/:productId', async (req, res) => {
    try {
        const { quantity } = req.body;
        if (quantity < 1) {
            return res.status(400).json({ error: 'Quantity must be at least 1' });
        }

        // First check product stock
        const product = await productModel.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Validate against stock
        if (quantity > product.stock) {
            return res.status(400).json({ 
                error: `Cannot update quantity. Only ${product.stock} available in stock.`
            });
        }

        const cart = await cartModel.findOne({});
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const cartProduct = cart.products.find(item => 
            item.product.toString() === req.params.productId
        );

        if (!cartProduct) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        cartProduct.quantity = quantity;
        await cart.save();
        
        res.json({ message: 'Cart updated' });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ error: 'Error updating cart' });
    }
});

export default router; 