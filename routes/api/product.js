const express = require('express');
const { getProducts } = require('../../services/index')

const router = express.Router();

router.get('/all', async (request, response, next) => {
    try {
        const products = await getProducts();

        return response.json({
            products
        })
    } catch (error) {
        next(error);
    }
});

module.exports = router;
