import express from 'express';
import { getProducts } from '../products/productsManager.js';
import { Server } from 'socket.io';

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

// Socket.IO setup
let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer);
    
    // Socket.IO connection event
    io.on('connection', (socket) => {
        console.log('New user connected');

        // Handle product actions
        socket.on('productAction', (data) => {
            console.log('Product action received:', data);
            console.log(`Product ID: ${data.id}`);
            console.log(`Action: ${data.action}`);
        });
    });
};

export default router;