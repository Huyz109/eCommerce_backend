'use strict'

const express = require('express');
const { asyncHandler } = require('../../authen/checkAuth');
const { authenticationV2 } = require('../../authen/authUtils');
const inventoryController = require('../../controllers/inventory.controller');
const router = express.Router();

router.use(authenticationV2)
router.post('', asyncHandler(inventoryController.addStock))

module.exports = router;