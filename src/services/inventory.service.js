'use strict'

const { BadRequestError } = require("../core/error.response")
const inventoryModel = require("../models/inventory.model")
const { getProductById } = require("../models/repositories/product.repo")

class InventoryService {
    static async addStockToInventory({stock, productId, shopId, location = ''}){
        const product = await getProductById(productId)
        if(!product) throw new BadRequestError('The product is not exist')
        
        const query = {inven_shopId: shopId, inven_productId: productId },
        updateSet = {
            $inc: {
                inven_stock: stock
            },
            $set: {
                inven_location: location
            }
        }, options = {upsert: true, new: true}

        return await inventoryModel.findByIdAndUpdate(query, updateSet, options)
    }
}

module.exports = InventoryService