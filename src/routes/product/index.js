'use strict'

const express = require('express');
const { asyncHandler } = require('../../authen/checkAuth');
const { authenticationV2 } = require('../../authen/authUtils');
const productController = require('../../controllers/product.controller');
const router = express.Router();

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))

// Authentication
router.use(authenticationV2)

//////////////////////////////////////
router.post('', asyncHandler(productController.createProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop))




// Query
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(productController.getAllPublishedForShop))


module.exports = router;