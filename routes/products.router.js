import express from 'express';
import { productModel } from '../models/products.model.js';
import { cartModel } from '../models/cart.model.js';

const router = express.Router();

// Get all products with sorting, filtering and pagination
router.get('/', async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Sorting parameters
        const sortField = req.query.sort || 'title';
        const sortOrder = req.query.order === 'desc' ? -1 : 1;
        const sortOptions = { [sortField]: sortOrder };

        // Filtering parameters
        const filterOptions = {};
        if (req.query.category) {
            filterOptions.category = req.query.category;
        }
        if (req.query.minPrice) {
            filterOptions.price = { $gte: parseFloat(req.query.minPrice) };
        }
        if (req.query.maxPrice) {
            filterOptions.price = { ...filterOptions.price, $lte: parseFloat(req.query.maxPrice) };
        }
        if (req.query.stock === 'available') {
            filterOptions.stock = { $gt: 0 };
        }
        if (req.query.status) {
            filterOptions.status = req.query.status === 'true';
        }

        // Get all carts for the selector
        const carts = await cartModel.find().lean();

        // Execute query with all parameters
        const products = await productModel.find(filterOptions)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .lean();

        // Get total count for pagination
        const totalProducts = await productModel.countDocuments(filterOptions);
        const totalPages = Math.ceil(totalProducts / limit);

        // Get unique categories using aggregation instead of distinct
        const categoriesResult = await productModel.aggregate([
            { $group: { _id: "$category" } },
            { $sort: { _id: 1 } }
        ]);
        const categories = categoriesResult.map(cat => cat._id).filter(Boolean);

        res.render("home", { 
            title: "Entrega Final",
            productos: products,
            carts: carts,
            pagination: {
                currentPage: page,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                nextPage: page + 1,
                prevPage: page - 1,
                totalProducts
            },
            filters: {
                categories,
                currentCategory: req.query.category,
                minPrice: req.query.minPrice,
                maxPrice: req.query.maxPrice,
                stock: req.query.stock,
                status: req.query.status
            },
            sorting: {
                field: sortField,
                order: req.query.order || 'asc'
            },
            limit: limit.toString()
        });
    } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).json({ error: 'Error retrieving products' });
    }
});

// Get specific product by ID
router.get('/:pid', async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).lean();
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.render('product-detail', {
            title: product.title,
            product: product
        });
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
router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await productModel.findByIdAndUpdate(
            req.params.pid,
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
router.delete('/:pid', async (req, res) => {
    try {
        const deletedProduct = await productModel.findByIdAndDelete(req.params.pid);
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