'use strict'

const express = require('express');
const { asyncHandler } = require('../../authen/checkAuth');
const { authenticationV2 } = require('../../authen/authUtils');
const discountController = require('../../controllers/discount.controller');
const router = express.Router();

// Authentication
router.use(authenticationV2)

//////////////////////////////////////
router.post('/amount', asyncHandler(discountController.getDiscountAmount))
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodeWithProduct))

router.post('', asyncHandler(discountController.createDiscount))
router.get('', asyncHandler(discountController.getAllDiscountCodes))


module.exports = router;