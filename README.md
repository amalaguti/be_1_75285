# E-commerce Backend Application

This is a Node.js/Express application that implements e-commerce functionality with MongoDB as the database.

## Features

### Products
- Complete CRUD operations for products
- View all products with pagination
- Customizable products per page display (1, 3, 5, 10, or 50 items)
- Filter products by:
  - Category
  - Price range
  - Stock availability
  - Status (active/inactive)
- Sort products by:
  - Title
  - Price
  - Stock
- View detailed product information on individual product pages
- Real-time product updates using WebSocket
- Stock tracking

### Cart
- Automatic cart creation
- Add/remove products
- Update quantities
- Empty entire cart
- Stock validation when adding/updating products
- Cart total calculation
- Cart persistence in database
- Quantity limits based on available stock

### Navigation & UI
- Product list pagination
- Category filtering
- Price range filtering
- Back to products navigation
- Cart view access
- Individual product detail pages
- Responsive design
- Interactive UI elements
- Real-time stock validation
- Success/error messaging

## Routes

### Products (`/api/products`)
- `GET /api/products` - View all products
  - Query Parameters:
    - `page`: Page number (default: 1)
    - `limit`: Items per page (1, 3, 5, 10, or 50; default: 10)
    - `sort`: Sort field (title, price, stock)
    - `order`: Sort order (asc, desc)
    - `category`: Filter by category
    - `minPrice`: Minimum price filter
    - `maxPrice`: Maximum price filter
    - `stock`: Filter by stock ("available" shows in-stock items)
    - `status`: Filter by status (true/false)
- `GET /api/products/:pid` - Get specific product details
- `POST /api/products` - Create new product
- `PUT /api/products/:pid` - Update product
- `DELETE /api/products/:pid` - Delete product

### Cart (`/api/carts`)
- `GET /api/carts` - View cart
- `GET /api/carts/:cid` - View specific cart
- `POST /api/carts` - Create new cart or get existing one
- `POST /api/carts/:cid/product/:pid` - Add product to cart
  - Validates stock availability
  - Prevents exceeding available stock
- `PUT /api/carts/:cid/product/:pid` - Update product quantity in cart
  - Validates against available stock
  - Body: `{ "quantity": number }`
- `PUT /api/carts/:cid` - Update all products in cart
- `DELETE /api/carts/:cid/product/:pid` - Remove product from cart
- `DELETE /api/carts/:cid` - Delete cart

### Real-time Products (`/api/realtimeproducts`)
- `GET /api/realtimeproducts` - View products with real-time updates via WebSocket

## Views

### Home View (Product List)
- Product cards with basic information
- Add to Cart functionality
- Filtering and sorting controls
- Pagination
- Links to product details

### Product Detail View
- Comprehensive product information
- Add to Cart functionality
- Back to products navigation
- Stock status display

### Cart View
- List of cart items with quantities
- Individual item removal
- Quantity adjustment
- Cart total
- Empty cart option
- Continue shopping navigation

## Technical Details

### Database
- MongoDB with Mongoose ODM
- Product and Cart models with references
- Lean queries for performance

### Data Validation
- Stock level checking
- Quantity validation
- Product existence verification
- Cart existence verification

### Error Handling
- Product not found
- Cart not found
- Invalid quantities
- Stock limitations
- Database operation errors

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

## Setup and Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your MongoDB credentials:
```bash
mongodb_user=your_username
mongodb_secret=your_password
```

Note: You can also use `.envrc` for direnv if you prefer, with the following format:
```bash
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

## Environment Variables
Required environment variables that must be set in `.env` or `.envrc`:
- `mongodb_user` - MongoDB Atlas username
- `mongodb_secret` - MongoDB Atlas password

These variables are used to construct the MongoDB connection string in the format:
```
mongodb+srv://${mongodb_user}:${mongodb_secret}@cluster0.nbmyio1.mongodb.net/entregaFinal
```

Note: The application port is currently hardcoded to 3000. To use a different port, you'll need to modify it directly in `app.js`.

## Technologies Used

- Express.js - Web framework
- MongoDB/Mongoose - Database
- Socket.IO - Real-time updates
- Handlebars - Template engine
- Node.js - Runtime environment

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