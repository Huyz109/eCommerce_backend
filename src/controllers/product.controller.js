'use strict'

const ProductFactory = require("../services/product.service");

class ProductController {

    createProduct = async(req, res, next) => {
        console.log(`[P]:::Create product: `, req.body);
        new SuccessResponse({
            message: 'Create product success !',
            // metadata: await AccessService.handleRefreshToken(req.body.refreshToken)
            metadata: await ProductFactory.createProduct(req.body.product_type, req.body)
        }).send(res)
    }
}

module.exports = new ProductController();