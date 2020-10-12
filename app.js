const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const chalk = require('chalk');
const createError = require('http-errors');
const isAuthenticated = require('./middleware/isAuthenticated')
require('dotenv').config();


// Importing helpers and utilities
const connectToDatabase = require('./utils/database');

const app = express();

// Connecting to database
(async () => {
    try {
        await connectToDatabase();
    } catch (error) {
        console.log(chalk.redBright(`Error connecting to database! Error details: ${error}`))
    }
})();

// Importing routes
const userRoutes = require('./routes/api/user');
const cartRoutes = require('./routes/api/cart');
const productRoutes = require('./routes/api/product');
const wishlistRoutes = require('./routes/api/wishlist');
const historyRoutes = require('./routes/api/history');

// Initializing middleware
app.use(cors());
app.use(isAuthenticated);

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// Registering routes
app.use('/api/user', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/product', productRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/history', historyRoutes);

// Catch 404 and forward to error handler
app.use(async (request, response, next) => {
    next(createError.NotFound());
})

// Error handler
app.use((error, request, response, next) => {
    console.log(error)
    response.status(error.status || 500);
    response.send({
        error: {
            status: error.status || 500,
            message: error.message
        }
    })
})
module.exports = app;
