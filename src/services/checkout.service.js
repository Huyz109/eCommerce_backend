'use strict'

const { BadRequestError } = require("../core/error.response")
const orderModel = require("../models/order.model")
const { findCartById } = require("../models/repositories/cart.repo")
const { checkProductByServer } = require("../models/repositories/product.repo")
const { getDiscountAmount } = require("./discount.service")
const { acquireLock, releaseLock } = require("./redis.service")

class CheckoutService {
    static async checkoutReview({cartId, userId, shop_order_ids}) {
        // Check cart exist
        const foundCart = await findCartById(cartId)
        if(!foundCart) throw new BadRequestError('Cart does not exist')

        const checkout_order = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0
        }, shop_order_ids_new = []

        // Calculate total bill
        for (let i = 0; i < shop_order_ids.length; i++) {
            const {shopId, shop_discounts = [], item_products = []} = shop_order_ids[i]
            // Check product available
            const checkProduct = await checkProductByServer(item_products)
            console.log(`Check product server:: `, checkProduct)
            if(!checkProduct[0]) throw new BadRequestError('Order wrong product!!!')

            // Total checkout
            const checkoutPrice = checkProduct.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            // Total bill before discount
            checkout_order.totalPrice = checkoutPrice
            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: checkProduct
            }

            // Check shop discounts 
            if(shop_discounts.length > 0) {
                // Get discount amount
                const {totalPrince = 0, discount = 0} = await getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProduct
                })

                // Total discount
                checkout_order.totalDiscount += discount

                if(discount > 0){
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            // Total checkout
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }

    }

    static async orderByUser({shop_order_ids, cartId, userId, user_address = {}, user_payment = {}}) {
        const { shop_order_ids_new, checkout_order} = await CheckoutService.checkoutReview(cartId, userId, shop_order_ids)
        // Check product quantity in inventory
        const products = shop_order_ids_new.flatMap(order => order.item_products)
        console.log('[1]:::::', products)
        const acquireProduct = []
        for(let i = 0; i < products.length; i++) {
            const {productId, quantity} = products[i]
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireProduct.push(keyLock ? true : false)
            if(keyLock) {
                await releaseLock(keyLock)
            }
        }
        // If product is out of stock
        if(acquireProduct.includes(false)) throw new BadRequestError('Một số sản phẩm đã được cập nhật, vui lòng quay lại giỏ hàng ...')
        const newOrder = orderModel.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        })

        // Insert done, remove all item in cart
        if(newOrder) {

        }

        return newOrder
    }

    static async getOrdersByUserId = () => {
        console.log("Ba")
    }

    static async getOneOrderByUserId = () => {
        
    }

    static async cancelOrderByUserId = () => {
        
    }

    static async updateOrderStatusByShop = () => {
        
    }
}

module.exports = CheckoutService