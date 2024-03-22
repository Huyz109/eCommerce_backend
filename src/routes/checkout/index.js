'use strict'

const express = require('express');
const { asyncHandler } = require('../../authen/checkAuth');
const { authenticationV2 } = require('../../authen/authUtils');
const checkoutController = require('../../controllers/checkout.controller');
const router = express.Router();

router.post('/review', asyncHandler(checkoutController.checkoutReview))

module.exports = router;