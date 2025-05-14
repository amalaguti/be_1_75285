# E-commerce Backend Project

A Node.js e-commerce backend project built with Express.js and MongoDB. Features product management, real-time product updates, and shopping cart functionality.

## Features

- Product management (CRUD operations)
- Real-time product updates using WebSocket
- Shopping cart with stock validation
- MongoDB integration
- Handlebars templating
- Advanced filtering and sorting
- Pagination support

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
  - Query Parameters:
    - `page`: Page number (default: 1)
    - `limit`: Items per page (default: 10)
    - `sort`: Sort field (title, price, stock)
    - `order`: Sort order (asc, desc)
    - `category`: Filter by category
    - `minPrice`: Minimum price filter
    - `maxPrice`: Maximum price filter
    - `stock`: Filter by stock ("available" shows in-stock items)
    - `status`: Filter by status (true/false)
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product

### Cart (`/api/carts`)
- `GET /api/carts` - View shopping cart
- `POST /api/carts/add/:productId` - Add product to cart
  - Validates stock availability
  - Prevents exceeding available stock
- `PUT /api/carts/update/:productId` - Update product quantity in cart
  - Validates against available stock
  - Body: `{ "quantity": number }`

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
export mongodb_user=your_username
export mongodb_secret=your_password
```

3. Run the application:
```bash
npx nodemon app.js
```
or 
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
- Advanced filtering and sorting capabilities
- Pagination for large product lists

### Shopping Cart
- Add/remove products
- Update quantities
- Stock validation
- Total calculation
- Quantity limits based on available stock

### Real-time Updates
- WebSocket integration for real-time product updates
- Live product list updates

### Filtering and Sorting
- Filter products by:
  - Category
  - Price range
  - Stock availability
  - Status
- Sort products by:
  - Title
  - Price
  - Stock
- Ascending or descending order
- Pagination with configurable items per page

## Project Structure

```
├── models/
│   ├── products.model.js  # Product schema and model
│   └── cart.model.js      # Cart schema and model
├── routes/
│   ├── products.router.js    # Product routes with filtering
│   ├── cart.router.js        # Cart management routes
│   └── realTimeProducts.router.js  # WebSocket routes
├── views/
│   ├── home.handlebars    # Product listing with filters
│   └── cart.handlebars    # Cart view
├── public/
│   └── css/
│       └── style.css      # Styles including filter UI
├── mongodb/
│   └── db.js             # Database connection
├── app.js                # Main application file
└── README.md

```

## Example Queries

Filter and sort products:
```
/api/products?category=electronics&minPrice=100&maxPrice=500&sort=price&order=desc&page=1&limit=10
```

This will:
- Show electronics products
- Price between $100 and $500
- Sort by price (highest first)
- Show first page
- 10 items per page

## Package Descriptions

- **express**: Web application framework
- **mongoose**: MongoDB object modeling tool
- **express-handlebars**: Template engine for Express
- **socket.io**: Real-time bidirectional event-based communication
- **dotenv**: Environment variables management
- **nodemon**: Development utility for automatic server restart 