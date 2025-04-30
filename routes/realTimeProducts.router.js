const express = require('express');
const router = express.Router();

const productsManager = require('../products/productsManager.js');


// GET /api/realtimeproducts
router.get('/', async (req, res) => {res.status(200).send('Websockets');});

module.exports = router;