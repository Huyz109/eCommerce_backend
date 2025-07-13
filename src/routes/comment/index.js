'use strict'

const express = require('express');
const { asyncHandler } = require('../../authen/checkAuth');
const { authenticationV2 } = require('../../authen/authUtils');
const CommentController = require('../../controllers/comment.controller');
const router = express.Router();

// Authentication
router.use(authenticationV2)

//////////////////////////////////////
router.post('', asyncHandler(CommentController.createComment))
router.get('', asyncHandler(CommentController.getCommentByParentId))


module.exports = router;