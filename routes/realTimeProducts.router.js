import express from 'express';
import { getProducts } from '../products/productsManager.js';
import { Server } from 'socket.io';

const router = express.Router();
const hiddenProducts = new Set(); // Set to store hidden product IDs

// GET /api/realtimeproducts
router.get('/', async (req, res) => {
    try {
        const productos = await getProducts();
        // Filter out hidden products when rendering the initial view
        const visibleProducts = productos.filter(product => !hiddenProducts.has(String(product.id)));
        res.render('realTimeProducts', { 
            title: 'Products List',
            productos: visibleProducts 
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
                    
                    // Add the product ID to the hidden set
                    hiddenProducts.add(String(data.id));
                    
                    // Filter out all hidden products
                    const updatedProducts = productos.filter(product => 
                        !hiddenProducts.has(String(product.id))
                    );
                    
                    console.log('Filtered products:', updatedProducts.map(p => ({ id: p.id, type: typeof p.id })));
                    console.log('Notifying clients of new action on product', data.id);
                    
                    // Emit to all connected clients
                    io.emit('productsUpdated', updatedProducts);
                } catch (error) {
                    console.error('Error updating products:', error.message);
                }
            } else if (data.action === 'unhideAll') {
                try {
                    const productos = await getProducts();
                    // Clear all hidden products
                    hiddenProducts.clear();
                    // Emit all products since none are hidden
                    io.emit('productsUpdated', productos);
                } catch (error) {
                    console.error('Error unhiding products:', error.message);
                }
            } else if (data.action === 'add') {
                try {
                    const productos = await getProducts();
                    // Just emit the original products list
                    // The client will handle adding the new product
                    io.emit('productsUpdated', productos);
                } catch (error) {
                    console.error('Error adding product:', error.message);
                }
            }
        });
    });
};

export default router;