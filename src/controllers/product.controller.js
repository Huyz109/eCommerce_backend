'use strict'

const { SuccessResponse } = require("../core/success.response");
const ProductFactory = require("../services/product.service");
const ProductServiceV2 = require("../services/product.service.xxx");

class ProductController {
    createProduct = async(req, res, next) => {
        console.log(`[P]:::Create product: `, req.body);
        // new SuccessResponse({
        //     message: 'Create product success !',
        //     metadata: await ProductFactory.createProduct(req.body.product_type, {
        //         ...req.body,
        //         product_shop: req.user.userId
        //     })
        // }).send(res)
        new SuccessResponse({
            message: 'Create product success !',
            metadata: await ProductServiceV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    updateProduct = async(req, res, next) => {
        console.log(`[P]:::Update product: `, req.body);
        new SuccessResponse({
            message: 'Update product success !',
            metadata: await ProductServiceV2.updateProduct(req.body.product_type, req.params.productId, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    publishProductByShop = async(req, res, next) => {
        new SuccessResponse({
            message: 'Publish shop success !',
            metadata: await ProductServiceV2.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res)
    }

    unPublishProductByShop = async(req, res, next) => {
        new SuccessResponse({
            message: 'Unpublish shop success !',
            metadata: await ProductServiceV2.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res)
    }

    // Query
    getAllDraftsForShop = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get all drafts for shop success !',
            metadata: await ProductServiceV2.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getAllPublishedForShop = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get all published for shop success !',
            metadata: await ProductServiceV2.findAllPublishForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getListSearchProduct = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get all product by search success !',
            metadata: await ProductServiceV2.searchProducts(req.params)
        }).send(res)
    }

    findAllProducts = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get all product success !',
            metadata: await ProductServiceV2.findAllProducts(req.query)
        }).send(res)
    }

    findProductById = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get product by id success !',
            metadata: await ProductServiceV2.findProduct({
                product_id: req.params.product_id
            })
        }).send(res)
    }
}

module.exports = new ProductController();