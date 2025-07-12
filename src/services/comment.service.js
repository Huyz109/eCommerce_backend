'use strict'

const { NotFoundError } = require("../core/error.response");
const Comment = require("../models/comment.model");
const { convertToObjectId } = require("../utils");

class CommentService {
    static async createCommnent({
        productId, userId, content, parentCommentId = null
    }) {
        const comment = new Comment({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        })

        let rightValue;

        if (parentCommentId) {
            // Reply comment
            const parentComment = await Comment.findById(parentCommentId);
            if (!parentComment) {
                throw new NotFoundError("Parent comment not found");
            }
            rightValue = parentComment.comment_right;
            // UpdateMany comment
            await Comment.updateMany({
                comment_productId: convertToObjectId(productId),
                comment_right: { $gte: rightValue }
            }, {
                $inc: { comment_right: 2 }
            })

            await Comment.updateMany({
                comment_productId: convertToObjectId(productId),
                comment_left: { $gte: rightValue }
            }, {
                $inc: { comment_left: 2 }
            })
        }
        else {
            const maxRightValue = await Comment.findOne({
                comment_productId: convertToObjectId(productId)
            }, 'comment_right', {
                sort: {
                    comment_right: -1
                }
            })

            if (maxRightValue) {
                rightValue = maxRightValue.right + 1;
            }
            else {
                rightValue = 1
            }
        }

        // Insert comment
        comment.comment_left = rightValue;
        comment.comment_right = rightValue + 1;

        await comment.save();
        return comment;
    }
}

module.exports = CommentService;