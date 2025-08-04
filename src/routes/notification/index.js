'use strict'

const express = require('express');
const { asyncHandler } = require('../../authen/checkAuth');
const { authenticationV2 } = require('../../authen/authUtils');
const NotificationController = require('../../controllers/notification.controller');
const router = express.Router();

// Authentication
router.use(authenticationV2)

//////////////////////////////////////
router.get('', asyncHandler(NotificationController.getNotiByUserId))


module.exports = router;