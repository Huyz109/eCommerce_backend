'use strict'

const cartModel = require("../models/cart.model")

class CartService {

    static async createUserCart({userId, product}) {
        const query = {cart_userId: userId, cart_state: 'active'}
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
        const userCart = cartModel.findOne({cart_userId: userId})
        if(!userCart) {
            // Create cart for user
            return await CartService.createUserCart({userId, product})
        }

        // Empty cart ?
        if(!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await cartModel.save()
        }

        // Update quantity if cart have product
        return await CartService.updateUserCartQuantity({userId, product})
    }
}

module.exports = CartService
