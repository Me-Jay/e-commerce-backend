const express = require('express');
const { getHistory, clearField } = require('../../services');
const { checkAuthorization } = require('../../helpers/authHelper');

const router = express.Router();

// Call service functions
const clearHistory = clearField('History');

const SUCCESS = 'success';
const FAILURE = 'failure';

// @route GET /api/history
// @description Get purchase history
router.get('/', async (request, response, next) => {
    try {
        checkAuthorization(request);

        const history = await getHistory(request.userId);

        return response.json({
            history
        });
    } catch (error) {
        next(error)
    }
})

// @route GET /api/clear
// @description Clear history
router.get('/clear', async (request, response, next) => {
    try {
        checkAuthorization(request);

        const historyCleared = await clearHistory(request.userId);

        if (!historyCleared) {
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

module.exports = router;
