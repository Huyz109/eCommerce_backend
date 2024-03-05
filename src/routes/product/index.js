'use strict'

const express = require('express');
const { asyncHandler } = require('../../authen/checkAuth');
const { authenticationV2 } = require('../../authen/authUtils');
const productController = require('../../controllers/product.controller');
const router = express.Router();

// Authentication
router.use(authenticationV2)

//////////////////////////////////////
router.post('', asyncHandler(productController.createProduct))


module.exports = router;