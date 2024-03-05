const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const { checkOverLoad } = require('./helpers/check.connect');
const app = express();
require('dotenv').config();

// console.log('Process: ', process.env)

// Init middlewares
// Log status request
app.use(morgan("dev"))
// morgan("combined")
// morgan("common")

// Secure Express apps  
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// Init db
// checkOverLoad();
require('./dbs/init.mongodb')

// Init routes
app.use('/', require('./routes/index'))

// Handling error
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((err, req, res, next) => {
    const statusCode = err.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: err.stack,
        message: err.message || 'Interval Server Error'
    })
})

module.exports = app;