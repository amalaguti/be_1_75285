const fs = require('fs')
const path = require('path');

const pathCarts = path.join(__dirname, 'carts.json');

// Initialize carts.json if it doesn't exist
if (!fs.existsSync(pathCarts)) {
    fs.writeFileSync(pathCarts, JSON.stringify([]));
}

function getCarts() {
    const carts = fs.readFileSync(pathCarts, 'utf-8');
    return JSON.parse(carts);
}

function createCart() {
    const carts = getCarts();
    const newCart = {
        id: carts.length + 1,
        products: []
    };
    carts.push(newCart);
    fs.writeFileSync(pathCarts, JSON.stringify(carts));
    return newCart;
}

function getCartById(cid) {
    const carts = getCarts();
    return carts.find(cart => cart.id === cid);
}

function addProductToCart(cid, pid) {
    const carts = getCarts();
    const cartIndex = carts.findIndex(cart => cart.id === cid);
    
    if (cartIndex === -1) {
        throw new Error('Cart not found');
    }

    const productIndex = carts[cartIndex].products.findIndex(product => product.id === pid);
    
    if (productIndex === -1) {
        // Product doesn't exist in cart, add it
        carts[cartIndex].products.push({
            id: pid,
            quantity: 1
        });
    } else {
        // Product exists, increment quantity
        carts[cartIndex].products[productIndex].quantity++;
    }

    fs.writeFileSync(pathCarts, JSON.stringify(carts));
    return carts[cartIndex];
}

module.exports = {
    createCart,
    getCartById,
    addProductToCart
} 