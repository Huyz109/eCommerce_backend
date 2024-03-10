'use strict'

const { BadRequestError } = require('../core/error.response')
const { product, clothing, electronic, furniture } = require('../models/product.model')
const { publishProductByShop, queryProduct, unPublishProductByShop, searchProductByUserId } = require('./repositories/product.repo')

// Define Factory class
class ProductFactory {
    static productRegistry = {} //key class
    
    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)
        return new productClass(payload).createProduct()
    }

    // Put
    static async publishProductByShop({product_shop, product_id}) {
        return await publishProductByShop({product_shop, product_id})
    }

    static async unPublishProductByShop({product_shop, product_id}) {
        return await unPublishProductByShop({product_shop, product_id})
    }

    // Query
    static async findAllDraftsForShop({product_shop, limit = 50, skip = 0}) {
        const query = { product_shop, isDraft: true}
        return await queryProduct({query, limit, skip})
    }

    static async findAllPublishForShop({product_shop, limit = 50, skip = 0}) {
        const query = { product_shop, isPublished: true}
        return await queryProduct({query, limit, skip})
    }

    static async getListSearchProduct({keySearch}) {
        return await searchProductByUserId({keySearch})
    }
}

// Define base Product class
class Product {
    constructor({
        product_name, product_thumb, product_description, product_prince,
        product_quantity, product_type, product_shop, product_attributes
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_prince = product_prince
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    async createProduct(product_id) {
        return await product.create({...this, _id: product_id})
    }
}

// Define sub class for different product types Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.product_attributes)
        if(!newClothing) throw new BadRequestError('Create new Clothing error')

        const newProduct = await super.createProduct()
        if(!newProduct) throw new BadRequestError('Create new Product error')
        return newProduct;
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create(
            {
                ...this.product_attributes,
                product_shop: this.product_shop
            })
        if(!newElectronic) throw new BadRequestError('Create new Electronic error')

        const newProduct = await super.createProduct(newElectronic._id)
        if(!newProduct) throw new BadRequestError('Create new Product error')
        return newProduct;
    }
}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create(
            {
                ...this.product_attributes,
                product_shop: this.product_shop
            })
        if(!newFurniture) throw new BadRequestError('Create new Furniture error')

        const newProduct = await super.createProduct(newFurniture._id)
        if(!newProduct) throw new BadRequestError('Create new Product error')
        return newProduct;
    }
}

// Register product types
ProductFactory.registerProductType('Electronics', Electronic)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)


module.exports = ProductFactory
