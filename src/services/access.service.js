'use strict'

const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt');
const crypto = require('crypto');


const roleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}
class AccessService {
    static signUp = async({name, email, password}) => {
        try {
            // Check email exist
            const holderShop = await shopModel.findOne({email}).learn();
            if (holderShop) {
                return {
                    code: '',
                    message: 'Shop already registed!',
                }
            }
            const passwordHash = await bcrypt.hash(password, 10);

            const newShop = await shopModel.create({name, email, passwordHash, roles: [roleShop.SHOP]});

            if(newShop) {
                // Create publicKey, privateKey
                const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096
                })
            }

        } catch (error) {
            return {
                code: '',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService;