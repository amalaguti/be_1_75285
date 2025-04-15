const fs = require('fs');
const path = require('path');

const pathProductos = path.join(__dirname, 'productos.json');

async function getProducts() {
    const productos = await fs.promises.readFile(pathProductos, 'utf-8');
    return JSON.parse(productos);
}

async function getProductById(pid) {
    const productos = await getProducts();
    return productos.find(producto => producto.id === pid);
}

async function addProduct(product) {
    const productos = await getProducts();
    productos.push(product);
    fs.writeFileSync(pathProductos, JSON.stringify(productos));
}

async function updateProduct(pid, updated) {
    const productos = await getProducts();
    productos[pid - 1] = updated;
    fs.writeFileSync(pathProductos, JSON.stringify(productos));
}

async function deleteProduct(pid) {
    let productos = await getProducts();
    productos = productos.filter(product => product.id !== pid);
    fs.writeFileSync(pathProductos, JSON.stringify(productos));
}

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};