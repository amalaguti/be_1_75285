import express from 'express';
import { cartModel } from '../models/cart.model.js';
import { productModel } from '../models/products.model.js';

const router = express.Router();

// Get all carts
router.get('/', async (req, res) => {
    try {
        const carts = await cartModel.find().populate('products.product').lean();
        res.render('carts', {
            title: 'All Shopping Carts',
            carts: carts
        });
    } catch (error) {
        console.error('Error retrieving carts:', error);
        res.status(500).json({ error: 'Error retrieving carts' });
    }
});

// Get specific cart by ID
router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartModel.findById(req.params.cid).populate('products.product').lean();
        
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
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

// Create new cart
router.post('/', async (req, res) => {
    try {
        const newCart = await cartModel.create({ products: [] });
        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error creating cart:', error);
        res.status(500).json({ error: 'Error creating cart' });
    }
});

// Add product to cart
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const product = await productModel.findById(pid);
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        let cart = await cartModel.findById(cid);
        
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Check if product already exists in cart
        const existingProduct = cart.products.find(item => 
            item.product.toString() === pid
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
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();
        res.redirect(`/api/carts/${cid}`);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Error adding to cart' });
    }
});

// Remove product from cart
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartModel.findById(cid);
        
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        cart.products = cart.products.filter(item => 
            item.product.toString() !== pid
        );

        await cart.save();
        res.json({ message: 'Product removed from cart' });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ error: 'Error removing from cart' });
    }
});

// Update product quantity in cart
router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        
        if (quantity < 1) {
            return res.status(400).json({ error: 'Quantity must be at least 1' });
        }

        // First check product stock
        const product = await productModel.findById(pid);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Validate against stock
        if (quantity > product.stock) {
            return res.status(400).json({ 
                error: `Cannot update quantity. Only ${product.stock} available in stock.`
            });
        }

        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const cartProduct = cart.products.find(item => 
            item.product.toString() === pid
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

// Delete cart
router.delete('/:cid', async (req, res) => {
    try {
        const cart = await cartModel.findByIdAndDelete(req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        res.json({ message: 'Cart deleted successfully' });
    } catch (error) {
        console.error('Error deleting cart:', error);
        res.status(500).json({ error: 'Error deleting cart' });
    }
});

export default router; 