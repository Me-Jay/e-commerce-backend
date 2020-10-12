const express = require('express');
const { addToWishlist, clearField, getItems, removeFromWishlist } = require('../../services');
const { checkAuthorization } = require('../../helpers/authHelper');

const router = express.Router();

const SUCCESS = 'success';
const FAILURE = 'failure';

// Call service functions
const clearWishlist = clearField('Wishlist');
const getWishlistItems = getItems('Wishlist');

// @route GET /api/wishlist/add
// @description Add item to wishlist
router.get('/add/:productId', async (request, response, next) => {
    try {
        checkAuthorization(request);

        const { productId } = request.params;

        const itemAdded = await addToWishlist(productId, request.userId);

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

// @route DELETE /api/wishlist/remove
// @decscription Remove item from wishlist
router.delete('/remove/:productId', async (request, response, next) => {
    try {
        checkAuthorization(request);

        const { productId } = request.params;

        const itemRemoved = await removeFromWishlist(productId, request.userId);

        if (!itemRemoved) {
            return response.json({
                status: FAILURE
            })
        }

        return response.json({
            status: SUCCESS
        })
    } catch (error) {
        next(error)
    }
})


// @router GET /api/wishlist/clear
// @description Clear wishlist items
router.get('/clear', async (request, response, next) => {
    try {
        checkAuthorization(request);

        const itemsCleared = await clearWishlist(request.userId);

        console.log(itemsCleared)

        if (!itemsCleared) {
            return response.json({
                status: FAILURE
            })
        }

        return response.json({
            status: SUCCESS
        });
    } catch (error) {
        next(error)
    }
})


// @router GET /api/wishlist/
// @description Get wishlist items
router.get('/', async (request, response, next) => {
    try {
        checkAuthorization(request);

        const wishlistItems = await getWishlistItems(request.userId);

        return response.json({
            wishlistItems
        });
    } catch (error) {
        next(error)
    }
})

module.exports = router;
