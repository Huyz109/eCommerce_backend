'use strict'

const express = require('express');
const { apiKey, permission } = require('../authen/checkAuth');
const router = express.Router();

// Check apiKey
router.use(apiKey)
// Check permission
router.use(permission('0000'))


router.use('/v1/api', require('./access/index'))
router.use('/v1/api/product', require('./product/index'))
router.use('/v1/api/discount', require('./discount/index'))
router.use('/v1/api/cart', require('./cart/index'))
router.use('/v1/api/checkout', require('./checkout/index'))
router.use('/v1/api/inventory', require('./inventory/index'))
router.use('/v1/api/comment', require('./comment/index'))



// router.get('', (req, res, next) => {
//     return res.status(200).json({
//         message: 'Welcome'
//     })
// })

module.exports = router;