'use strict'

const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require("./keytoken.service");
const { createTokenPair } = require("../authen/authUtils");
const { getInfoData } = require("../utils");


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
            const holderShop = await shopModel.findOne({email}).learn()
            if (holderShop) {
                return {
                    code: 'xxx',
                    message: 'Shop already registered!',
                }
            }
            const passwordHash = await bcrypt.hash(password, 10);
            const newShop = await shopModel.create({name, email,password: passwordHash, roles: [roleShop.SHOP]});

            if(newShop) {
                // Create publicKey, privateKey
                const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'pkcs1', //Public key crypto standards 1
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1', //Public key crypto standards 1
                        format: 'pem'
                    }
                })

                console.log({publicKey, privateKey});

                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey
                });

                if(!publicKeyString) {
                    return {
                        code: '',
                        message: 'Public key string error',
                    }
                }   

                const publicKeyObject = crypto.createPublicKey(publicKeyString);

                // Create token pair
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKeyString, privateKey)
                console.log(`Create toke success: `, tokens);

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
                        tokens
                    }
                }
            }
            return {
                code: 201,
                metadata: null
            }

        } catch (error) {
            return {
                code: 'err',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService;