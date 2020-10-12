const express = require('express');
const { body, validationResult } = require('express-validator');
const createError = require('http-errors');
const { register, login } = require('../../services/index');
const { verifyRefreshToken, createAccessToken, createRefreshToken } = require('../../helpers/jwtHelper');

const router = express.Router();

// @router POST api/users/register
// @description Register a user
router.post('/register', [
    body('email', 'Invalid email!').isEmail()
], async (request, response, next) => {
    try {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            const [error] = errors.array();
            throw createError.BadRequest(error.msg);
        }

        const newUser = await register(request.body);
        return response.json({
            ...newUser._doc,
            password: null
        });
    } catch (error) {
        next(error);
    }
})

// @route POST api/user/auth
// @description Login/Authenticate a user
router.post('/auth', [
    body('email', 'Invalid email!').isEmail()
], async (request, response, next) => {
    try {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            const [error] = errors.array();
            throw createError.BadRequest(error.msg);
        }

        const authData = await login(request.body);
        return response.json(authData);
    } catch (error) {
        next(error)
    }
})

// @route POST api/user/refresh-token
// @description Get a new access token
router.post('/refresh-auth', [
    body('refreshToken', 'Invalid refresh token').notEmpty()
], async (request, response, next) => {
    try {
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            const [error] = errors.array();
            throw createError.BadRequest(error.msg);
        }

        const { refreshToken: oldRefreshToken } = request.body;

        const { userId, email } = await verifyRefreshToken(oldRefreshToken);

        const accessToken = await createAccessToken(userId, email);
        const newRefreshToken = await createRefreshToken(userId, email);

        return response.json({
            accessToken,
            refreshToken: newRefreshToken
        })

    } catch (error) {
        next(error)
    }
})

module.exports = router;
