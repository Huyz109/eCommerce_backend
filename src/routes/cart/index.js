'use strict'

const express = require('express');
const { asyncHandler } = require('../../authen/checkAuth');
const { authenticationV2 } = require('../../authen/authUtils');
const cartController = require('../../controllers/cart.controller');
const router = express.Router();

router.post('', asyncHandler(cartController.createCart))
router.delete('', asyncHandler(cartController.deleteCart))
router.post('/update', asyncHandler(cartController.updateCart))
router.get('', asyncHandler(cartController.getListUserCart))

module.exports = router;