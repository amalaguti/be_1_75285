import express from 'express';
import { getProducts } from '../products/productsManager.js';

const router = express.Router();

// GET /api/realtimeproducts
router.get('/', async (req, res) => {
    try {
        const productos = await getProducts();
        res.render('realTimeProducts', { 
            title: 'Products List',
            productos: productos 
        });
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ error: 'Error fetching products' });
    }
});

export default router;