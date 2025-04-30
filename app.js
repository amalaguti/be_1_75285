const path = require('path');

// Express
const express = require('express')
const app = express()
const port = 3000
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (css, js, img files)
app.use(express.static(path.join(__dirname, 'public')));

// handlebars
const handlebars = require('express-handlebars');
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Import productsManager
const productsManager = require('./products/productsManager.js');

// Routes
const realTimeProductsRouter = require('./routes/realTimeProducts.router.js');


// Home shows all products
app.get('/', async (req, res) => {
    try {
        const productos = await productsManager.getProducts();
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


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
