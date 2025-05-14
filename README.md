# E-commerce Backend Project

A Node.js e-commerce backend project built with Express.js and MongoDB. Features product management, real-time product updates, and shopping cart functionality.

## Features

- Product management (CRUD operations)
- Real-time product updates using WebSocket
- Shopping cart with stock validation
- MongoDB integration
- Handlebars templating

## Dependencies

```json
{
  "dependencies": {
    "dotenv": "^16.5.0",
    "express": "^5.1.0",
    "express-handlebars": "^8.0.1",
    "mongoose": "^8.14.3",
    "socket.io": "^4.8.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}
```

## Routes

### Products (`/api/products`)
- `GET /api/products` - View all products
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### Cart (`/api/carts`)
- `GET /api/carts` - View shopping cart
- `POST /api/carts/add/:productId` - Add product to cart
- `DELETE /api/carts/remove/:productId` - Remove product from cart
- `PUT /api/carts/update/:productId` - Update product quantity in cart

### Real-time Products (`/api/realtimeproducts`)
- `GET /api/realtimeproducts` - View products with real-time updates via WebSocket

### Legacy Routes
- `GET /entrega2` - View products from file system (legacy feature)
- `GET /custom_layout` - Test custom handlebars layout

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.envrc` file with your MongoDB credentials:
I use direnv tool to create environment variables when accessing local folder
```
mongodb_user=your_username
mongodb_secret=your_password
```

3. Run the application:
```bash
npm run dev
```

## Technologies Used

- Express.js - Web framework
- MongoDB/Mongoose - Database
- Socket.IO - Real-time updates
- Handlebars - Template engine
- Node.js - Runtime environment

## Features in Detail

### Product Management
- Complete CRUD operations for products
- Stock tracking

### Shopping Cart
- Add/remove products
- Update quantities
- Stock validation
- Total calculation
- Quantity limits based on available stock

### Real-time Updates
- WebSocket integration for real-time product updates
- Live product list updates

## Project Structure

```
├── models/
│   ├── products.model.js
│   └── cart.model.js
├── routes/
│   ├── products.router.js
│   ├── cart.router.js
│   └── realTimeProducts.router.js
├── views/
│   ├── home.handlebars
│   └── cart.handlebars
├── public/
│   └── css/
│       └── style.css
├── mongodb/
│   └── db.js
├── app.js
└── README.md
```

## Package Descriptions

- **express**: Web application framework
- **mongoose**: MongoDB object modeling tool
- **express-handlebars**: Template engine for Express
- **socket.io**: Real-time bidirectional event-based communication
- **dotenv**: Environment variables management
- **nodemon**: Development utility for automatic server restart 