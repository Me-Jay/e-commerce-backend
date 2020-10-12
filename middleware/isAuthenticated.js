const { verifyAccessToken, verifyRefreshToken } = require('../helpers/jwtHelper');

module.exports = async (request, response, next) => {
    try {
        const authHeader = request.get('Authorization');

        if (!authHeader) {
            request.isAuthenticated = false;
            return next();
        }

        const token = authHeader.split(' ')[1];

        if (!token || token === '') {
            request.isAuthenticated = false;
            return next();
        }

        const decodedToken = await verifyAccessToken(token);

        if (!decodedToken) {
            request.isAuthenticated = false;
            return next();
        }

        request.isAuthenticated = true;
        request.userId = decodedToken.userId;
        return next();

    } catch (error) {
        request.isAuthenticated = false;
        request.jwtExpired = true;
        request.error = error;
        return next();
    }
}
