'use strict'

const { NotFoundError } = require("../core/error.response");
const Comment = require("../models/comment.model");
const { convertToObjectId } = require("../utils");

class CommentService {
    static async createCommnent({
        productId, userId, content, parentCommentId = null
    }) {
        // Create new comment instance
        const comment = new Comment({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        })

        let rightValue;

        if (parentCommentId) {
            // Handle reply to existing comment
            const parentComment = await Comment.findById(parentCommentId);
            if (!parentComment) {
                throw new NotFoundError("Parent comment not found");
            }

            // Get the right value of parent comment
            rightValue = parentComment.comment_right;

            // Make space for new comment by updating existing left/right values
            // Increment right values >= parent's right value by 2
            await Comment.updateMany({
                comment_productId: convertToObjectId(productId),
                comment_right: { $gte: rightValue }
            }, {
                $inc: { comment_right: 2 }
            })

            // Increment left values >= parent's right value by 2
            await Comment.updateMany({
                comment_productId: convertToObjectId(productId),
                comment_left: { $gte: rightValue }
            }, {
                $inc: { comment_left: 2 }
            })
        }
        else {
            // Handle new root-level comment
            // Find the maximum right value to append new comment at the end
            const maxRightValue = await Comment.findOne({
                comment_productId: convertToObjectId(productId)
            }, 'comment_right', {
                sort: {
                    comment_right: -1
                }
            })

            // If comments exist, place new comment at the end
            // Otherwise start new tree with left=1, right=2
            if (maxRightValue) {
                rightValue = maxRightValue.comment_right + 1;
            }
            else {
                rightValue = 1
            }
        }

        // Set the left/right values for new comment
        // In Nested Set Model, right = left + 1 for leaf nodes
        comment.comment_left = rightValue;
        comment.comment_right = rightValue + 1;

        await comment.save();
        return comment;
    }

    static async getCommentsByParentId({ productId, parentCommentId = null, limit = 50, offset = 0 }) {
        if (parentCommentId) {
            const parentComment = await Comment.findById(parentCommentId);
            if (!parentComment) {
                throw new NotFoundError("Comment not found for product");
            }
            const comments = await Comment.find({
                comment_productId: convertToObjectId(productId),
                comment_left: {
                    $gt: parent.comment_left
                },
                comment_right: {
                    $lte: parent.comment_right
                }
            }).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1
            }).sort({
                comment_left: 1
            })

            return comments;
        }

        const comments = await Comment.find({
            comment_productId: convertToObjectId(productId),
            comment_parentId: null
        }).select({
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            comment_parentId: 1
        }).sort({
            comment_left: 1
        })

        return comments;
    }
}

module.exports = CommentService;