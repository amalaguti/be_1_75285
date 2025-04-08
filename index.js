const productsManager = require('./productsManager.js');
const cartManager = require('./CartManager.js');

console.log(productsManager.getProducts())

function createCart() {
    try {
        const newCart = cartManager.createCart();
        console.log('New cart created successfully');
        return newCart;
    } catch (error) {
        console.error('Error creating cart:', error.message);
        throw error;
    }
}

function addProductToCart(cartId, productId) {
    try {
        // Check if the product exists
        const product = productsManager.getProductById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        console.log('Product found:', product);

        // Check if the cart exists, if not create a new one
        let cart = cartManager.getCartById(cartId);
        if (!cart) {
            console.log('Cart not found, creating new cart...');
            cart = createCart();
            cartId = cart.id; // Update cartId to the newly created cart's ID
        }

        // Add the product to the cart
        const updatedCart = cartManager.addProductToCart(cartId, productId);
        console.log('Product added to cart successfully');
        return updatedCart;
    } catch (error) {
        console.error('Error adding product to cart:', error.message);
        throw error;
    }
}

// Example usage:
// const newCart = createCart();
// console.log('New cart:', newCart);
// 
const cartId = 1; // Replace with actual cart ID
const productId = 1; // Replace with actual product ID
const result = addProductToCart(cartId, productId);
console.log('Updated cart:', result);

