const express = require('express');
const {
    clearField,
    getItems,
    addToCart,
    removeFromCart,
    updateCartItem,
    checkout
} = require('../../services');
const { checkAuthorization } = require('../../helpers/authHelper');


const router = express.Router();

const SUCCESS = 'success';
const FAILURE = 'failure';

// Call service functions
const clearCart = clearField('Cart');
const getCartItems = getItems('Cart');


// @route GET /api/cart/add
// @description Add item to cart
router.get('/add/:productId', async (request, response, next) => {
    try {
        checkAuthorization(request);

        const { productId } = request.params;

        const itemAdded = await addToCart(productId, request.userId);

        if (!itemAdded) {
            return response.json({
                status: FAILURE
            })
        }

        return response.json({
            status: SUCCESS
        })
    } catch (error) {
        next(error);
    }
})

// @route DELETE /api/cart/remove
// @description Remove item from cart
router.delete('/remove/:productId', async (request, response, next) => {
    try {
        checkAuthorization(request);

        const { productId } = request.params;

        const itemRemoved = await removeFromCart(productId, request.userId);

        if (!itemRemoved) {
            return response.json({
                status: FAILURE
            });
        }
        return response.json({
            status: SUCCESS
        });
    } catch (error) {
        next(error);
    }
})

// @route GET /api/cart/clear
// @description Clear cart items
router.get('/clear', async (request, response, next) => {
    try {
        checkAuthorization(request);

        const itemsCleared = await clearCart(request.userId);

        if (!itemsCleared) {
            return response.json({
                status: FAILURE
            })
        }

        return response.json({
            status: SUCCESS
        });
    } catch (error) {
        next(error);
    }
})

// @route PUT /api/cart/update
// @descritpion Update cart item
router.put('/update/:productId', async (request, response, next) => {
    try {
        checkAuthorization(request);

        const { productId } = request.params;
        const { quantity } = request.body;

        const itemUpdated = await updateCartItem(productId, request.userId, quantity);

        if (!itemUpdated) {
            return response.json({
                status: FAILURE,
                message: "No item updated"
            })
        }

        return response.json({
            status: SUCCESS,
            message: "Item updated"
        })
    } catch (error) {
        next(error)
    }
})

// @route GET /api/cart
// @description Get cart items
router.get('/', async (request, response, next) => {
    try {
        checkAuthorization(request);

        const cartItems = await getCartItems(request.userId);

        return response.json({
            cartItems
        })
    } catch (error) {
        next(error)
    }
})

// @route POST /api/checkout
// @description Checkout
router.post('/checkout', [], async (request, response, next) => {
    try {
        checkAuthorization(request);

        const { totalAmount, cardDetails } = request.body;

        const historyAdded = await checkout(request.userId, totalAmount, cardDetails);

        if (!historyAdded) {
            return response.json({
                status: FAILURE
            })
        }

        return response.json({
            status: SUCCESS
        })
    } catch (error) {
        next(error);
    }
})


module.exports = router;

