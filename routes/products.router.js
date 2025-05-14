import express from 'express';
import { productModel } from '../models/products.model.js';

const router = express.Router();

let app;

export const setApp = (_app) => {
    app = _app;
};

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await productModel.find({});
        console.log('>>>>>> Products:', products);
        if (app) {
            res.render("home", { 
                title: "Entrega Final",
                productos: products
            });
        } else {
            res.status(500).json({ error: 'Rendering not configured' });
        }
    } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).json({ error: 'Error retrieving products' });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await productModel.findOne({ id: req.params.id });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error retrieving product:', error);
        res.status(500).json({ error: 'Error retrieving product' });
    }
});

// Create new product
router.post('/', async (req, res) => {
    try {
        const newProduct = new productModel(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Error creating product' });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await productModel.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Error updating product' });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await productModel.findOneAndDelete({ id: req.params.id });
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Error deleting product' });
    }
});

export default router; 