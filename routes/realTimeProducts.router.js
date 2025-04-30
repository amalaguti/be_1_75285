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
        socket.on('productAction', async (data) => {
            console.log('Product action received:', data);
            console.log(`Product ID: ${data.id} (type: ${typeof data.id})`);
            console.log(`Action: ${data.action}`);

            if (data.action === 'hide') {
                try {
                    const productos = await getProducts();
                    console.log('Current products:', productos.map(p => ({ id: p.id, type: typeof p.id })));
                    
                    // Convert both IDs to strings for comparison
                    const updatedProducts = productos.filter(product => 
                        String(product.id) !== String(data.id)
                    );
                    
                    console.log('Filtered products:', updatedProducts.map(p => ({ id: p.id, type: typeof p.id })));
                    console.log('Notifying clients of new action on', data.id);
                    
                    // Emit to all connected clients
                    io.emit('productsUpdated', updatedProducts);
                } catch (error) {
                    console.error('Error updating products:', error.message);
                }
            }
        });
    });
};

export default router;