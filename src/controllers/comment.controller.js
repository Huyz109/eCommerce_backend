'use strict'

const { SuccessResponse } = require("../core/success.response")
const CommentService = require("../services/comment.service")

class CommentController {
    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new comment successfully!',
            metadata: await CommentService.createCommnent(req.body)
        }).send(res)
    }

    getCommentByParentId = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get comments by parentId successfully!',
            metadata: await CommentService.getCommentsByParentId(req.query)
        }).send(res)
    }
}

module.exports = new CommentController()