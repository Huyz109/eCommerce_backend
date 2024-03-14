'use strict'

const { find } = require("lodash")
const { BadRequestError, NotFoundError } = require("../core/error.response")
const discountModel = require("../models/discount.model")
const { findAllProducts } = require("../models/repositories/product.repo")
const { convertToObjectId } = require("../utils")
const { findAllDiscountCodesUnselect, checkDiscountExists } = require("../models/repositories/discount.repo")

class DiscountService {
    static async createDiscountCode (payload) {
        const {code, start_date, end_date, isActive, shopId,
        min_order_value, productIds, applies_to, name, description,
        type, value, max_value, max_uses, used_count, max_use_per_user} = payload
        // Check
        if(new Date() < new Date(start_date) || new Date() > new Date(end_date)){
            throw new BadRequestError('Discount code has expired!')
        }

        if(new Date(start_date) >= new Date(end_date)) throw new BadRequestError('Start date must be before end date')

        // Create index for discount code
        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shopId: convertToObjectId(shopId)
        }).lean()

        if(foundDiscount && foundDiscount.discount_isActive){
            throw new BadRequestError('Discount existed!')
        }

        const newDiscount = await discountModel.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_max_value: max_value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_used_count: used_count,
            discount_users_used: users_used,
            discount_max_use_per_user: max_use_per_user,
            discount_min_order_value: min_order_value || 0,
            discount_shopId: shopId,
            discount_isActive: isActive,
            discount_applies_to: applies_to,
            discount_productIds: applies_to === 'All' ? [] : productIds,
        })

        return newDiscount
    }

    static async updateDiscountCode() {

    }

    // Get all discount code with products
    static async getAllDiscountCodeWithProduct({code, shopId, userId, limit, page}) {
        // Create index for discount_code
        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shopId: convertToObjectId(shopId)
        }).lean()    

        if(!foundDiscount || !foundDiscount.discount_isActive) {
            throw new NotFoundError('Discount not exists !')
        }

        const {discount_applies_to, discount_productIds} = foundDiscount
        let products
        if(discount_applies_to === 'all') {
            // Get all product
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectId(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        if(discount_applies_to = 'specific') {
            // Get the product Id
            products = await findAllProducts({
                filter: {
                    _id: {$in: discount_productIds},
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        return products;
    }

    // Get all discount code by shop
    static async getAllDiscountCodeByShop({limit, page, shopId}) {
        const discounts = await findAllDiscountCodesUnselect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectId(shopId),
                discount_isActive: true
            },
            unSelect: ['__v', 'discount_shopId'],
            model: discountModel
        })

        return discounts
    }

    // Apply discount 
    static async getDiscountAmount({codeId, userId, shopId, products}){
        const foundDiscount = await checkDiscountExists({
            model: discountModel,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectId(shopId)
            }
        })

        if(!foundDiscount) throw new NotFoundError(`Discount doesn't exist`)
        const {
            discount_isActive, 
            discount_max_uses, 
            discount_min_order_value,
            discount_max_use_per_user
        } = foundDiscount;

        if(!discount_isActive) throw new NotFoundError("Discount expired")
        if(!discount_max_uses) throw new NotFoundError('Discount are out!')

        if(new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) 
            throw new NotFoundError('Discount code has been expired!')

        // 
        let totalOrder
        if(discount_min_order_value > 0) {
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.prince)
            }, 0)  

            if(totalOrder < discount_min_order_value) {
                throw new NotFoundError(`Discount requires a minium order value of ${discount_min_order_value}!`)
            }
        }
        if(discount_max_use_per_user > 0) {
            const userUseDiscount = discount_users_used.find(user => user.userId === userId)
            if(userUseDiscount) {

            }
        }

        // 
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * discount_value / 100

        return {
            totalOrder,
            discount: amount,
            totalPrince: totalOrder - amount
        }
    }

    static async deleteDiscountCode({shopId, codeId}) {

        const deleted = await discountModel.findOne({
            discount_code: codeId,
            discount_shopId: convertToObjectId(shopId)
        })

        return deleted
    }

    static async cancelDiscountCode({codeId, shopId, userId}) {
        const foundDiscount = await checkDiscountExists({
            model: discountModel,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectId(shopId)
            }
        })

        if(!foundDiscount) throw new NotFoundError(`Discount doesn't exist`)

        const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId,
            },
            $inc: {
                discount_max_uses: 1,
                discount_used_count: -1
            }
        })
        return result
    }

}

module.exports = DiscountService