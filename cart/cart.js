const productsManager = require('./productsManager.js');
const cartManager = require('./CartManager.js');
(async () => {
    try {
        const products = await productsManager.getProducts();
        console.log(products);
    } catch (error) {
        console.error('Error fetching products:', error.message);
    }
})();


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

async function addProductToCart(cartId, productId) {
    try {
        // Check if the product exists
        const product = await productsManager.getProductById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        console.log('Product found:', product);

        // Check if the cart exists, if not create a new one
        let cart = await cartManager.getCartById(cartId);
        if (!cart) {
            console.log('Cart not found, creating new cart...');
            cart = createCart();
            cartId = cart.id; // Update cartId to the newly created cart's ID
        }

        // Add the product to the cart
        const updatedCart = await cartManager.addProductToCart(cartId, productId);
        console.log('Product added to cart successfully');
        return updatedCart;
    } catch (error) {
        console.error('Error adding product to cart:', error.message);
        throw error;
    }
}


const cartId = 1; // Replace with actual cart ID
const productId = 1; // Replace with actual product ID
(async () => {
    try {
        const result = await addProductToCart(cartId, productId);
        console.log('Updated cart:', result);
    } catch (error) {
        console.error('Error updating cart:', error.message);
    }
})();

