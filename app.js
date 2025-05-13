import path from 'path';
import express from 'express';
import handlebars from 'express-handlebars';
import { getProducts } from './products/productsManager.js';
import realTimeProductsRouter, { initSocket } from './routes/realTimeProducts.router.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createServer } from 'http';
import { connectDB, uri, clientOptions } from './mongodb/db.js';

import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Express
const app = express()
const port = 3000
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (css, js, img files)
app.use(express.static(path.join(__dirname, 'public')));

// handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');


// Connect to MongoDB
console.log('>>>>>> Connecting to MongoDB');
console.log(uri);
console.log(clientOptions);
connectDB();



// Home shows all products
app.get('/', async (req, res) => {
    try {
        const productos = await getProducts();
        res.render("home", { 
            title: "Entrega 2",
            productos: productos
        });
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).send('Error loading products');
    }
});

app.get('/custom_layout', (req, res) => {
    res.render("home", { 
        layout: 'custom-layout',
        title: "Custom Layout Test",
    });
});

// /api/realtimeproducts uses websockets
app.use('/api/realtimeproducts', realTimeProductsRouter);

// Create HTTP server and initialize Socket.IO
const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
