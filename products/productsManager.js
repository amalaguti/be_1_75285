// This file is used to manage the products in the fs
// This file was part of a previous task and is no longer needed
// It is kept here for reference
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pathProductos = path.join(__dirname, 'productos.json');

async function getProducts() {
    try {
        console.log("Retrieving products...")
        const productos = await fs.promises.readFile(pathProductos, 'utf-8');
        return JSON.parse(productos);
    } catch (error) {
        console.error('Error reading products file:', error.message);
        throw error; // Re-throw to let the router handle it
    }
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

export {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};