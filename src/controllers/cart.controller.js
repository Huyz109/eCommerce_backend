'use strict'

const { SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
    createCart = async(req, res, next) => {
        console.log(`[P]:::Create cart: `, req.body);
        new SuccessResponse({
            message: 'Create new cart success !',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

    updateCart = async(req, res, next) => {
        console.log(`[P]:::Update cart: `, req.body);
        new SuccessResponse({
            message: 'Update cart success !',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }

    deleteCart = async(req, res, next) => {
        console.log(`[P]:::Delete cart: `, req.body);
        new SuccessResponse({
            message: 'Delete cart success !',
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res)
    }

    getListUserCart = async(req, res, next) => {
        console.log(`[P]:::Get list user cart: `, req.body);
        new SuccessResponse({
            message: 'Get list user cart success !',
            metadata: await CartService.getListUserCart(req.query)
        }).send(res)
    }
}

module.exports = new CartController()