'use strict'

const { SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
    createDiscount = async(req, res, next) => {
        console.log(`[P]:::Create discount: `, req.body);
        new SuccessResponse({
            message: 'Create discount success !',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getAllDiscountCodes = async(req, res, next) => {
        console.log(`[P]:::Get all discount codes: `, req.body);
        new SuccessResponse({
            message: 'Get all discount code success !',
            metadata: await DiscountService.getAllDiscountCodeByShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getDiscountAmount = async(req, res, next) => {
        console.log(`[P]:::Get discount amount: `, req.body);
        new SuccessResponse({
            message: 'Get discount amount success !',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            })
        }).send(res)
    }

    getAllDiscountCodeWithProduct = async(req, res, next) => {
        console.log(`[P]:::Get all discount with product: `, req.body);
        new SuccessResponse({
            message: 'Get all discount with product success !',
            metadata: await DiscountService.getAllDiscountCodeWithProduct({
                ...req.query
            })
        }).send(res)
    }
}

module.exports = new DiscountController()