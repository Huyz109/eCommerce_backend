'use strict'

const { SuccessResponse } = require("../core/success.response");
const InventoryService = require("../services/inventory.service");

class InventoryController {
    addStock = async(req, res, next) => {
        console.log(`[P]:::Add stock to inventory: `, req.body);
        new SuccessResponse({
            message: 'Add stock success !',
            metadata: await InventoryService.addStockToInventory(req.body)
        }).send(res)
    }
}

module.exports = new InventoryController()