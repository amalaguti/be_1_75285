const express = require('express');
const router = express.Router();

const productsManager = require('../products/productsManager.js');


// GET /api/realtimeproducts
router.get('/', async (req, res) => {
    try {
        const products = await productsManager.getProducts();
        console.log("Retrieving products...")
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ error: 'Error fetching products' });
    }
});

module.exports = router;