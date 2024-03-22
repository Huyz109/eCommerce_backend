'use strict'

const { NotFoundError } = require("../core/error.response")
const cartModel = require("../models/cart.model")
const { getProductById } = require("../models/repositories/product.repo")

class CartService {

    static async createUserCart({userId, product}) {
        const query = {cart_userId: userId, cart_state: 'active'},
        updateOrInsert = {
            $addToSet: {
                cart_products: product
            }
        }, options = {upsert: true, new: true}

        return await cartModel.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateUserCartQuantity({userId, product}) {
        const {productId, quantity} = product
        const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active' 
        },updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
        }, options = {upsert: true, new: true}

        return await cartModel.findOneAndUpdate(query, updateSet, options)
    }

    static async addToCart({userId, product = {}}) {
        // Check cart exist ?
        const userCart = await cartModel.findOne({cart_userId: userId})
        if(!userCart) {
            // Create cart for user
            return await CartService.createUserCart({userId, product})
        }

        // Empty cart ?
        if(!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }

        // Update quantity if cart have product
        return await CartService.updateUserCartQuantity({userId, product})
    }

    // Update to cart
    /*
        shop_order_ids: {
            shopId,
            item_products: [{quantity, price, shopId, old_quantity, productId}], 
            version
        }
    */
    static async addToCartV2({userId, shop_order_ids}) {
        const {productId, quantity, old_quantity} = shop_order_ids[0]?.item_products[0]
        // Check product
        const foundProduct = await getProductById(productId)
        if(!foundProduct) throw new NotFoundError('')

        // Compare 
        if(foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError('Product not belong to the shop')
        }

        if(quantity === 0) {
            // Deleted

        }

        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    static async deleteUserCart({userId, productId}) {
        const query = {cart_userId: userId, cart_state: 'active'},
        updateSet = {
            $pull: {
                cart_products: {productId}
            }
        }

        const deleteCart = await cartModel.updateOne(query, updateSet)
        return deleteCart
    }

    static async getListUserCart({userId}) {
        return await cartModel.findOne({
            cart_userId: +userId
        }).lean()
    }
}

module.exports = CartService
