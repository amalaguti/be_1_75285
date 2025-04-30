const path = require('path');

// Express
const express = require('express')
const app = express()
const port = 3000
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// handlebars
const handlebars = require('express-handlebars');
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');


// Routes
const realTimeProductsRouter = require('./routes/realTimeProducts.router.js');
app.use('/api/realtimeproducts', realTimeProductsRouter);



app.get('/', (req, res) => {
  //res.send('Hello World !!!')
	res.render("home", { 
    layout: 'custom-layout',
		title: "Entrega 2",
	});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
