'use strict'

const { BadRequestError } = require("../core/error.response")
const { findCartById } = require("../models/repositories/cart.repo")
const { checkProductByServer } = require("../models/repositories/product.repo")
const { getDiscountAmount } = require("./discount.service")

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
}

module.exports = CheckoutService