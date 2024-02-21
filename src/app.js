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

// Init db
// checkOverLoad();

// Init routes
app.use('/', require('./routes/index'))

// Handling error


module.exports = app;