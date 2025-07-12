'use strict'

const { createCommnent } = require("../services/comment.service")
const { SuccessResponse } = require("../core/success.response");

class CommentController {
    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: "Create new comment",
            metadata: await createCommnent(req.body)
        }).send(res)
    }
}

module.exports = new CommentController()