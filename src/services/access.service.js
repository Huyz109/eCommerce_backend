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
            const holderShop = await shopModel.findOne({email}).lean()
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
                // const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1', //Public key crypto standards 1
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1', //Public key crypto standards 1
                //         format: 'pem'
                //     }
                // })
                const publicKey = crypto.randomBytes(64).toString('hex');
                const privateKey = crypto.randomBytes(64).toString('hex');

                console.log({publicKey, privateKey});

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                });

                if(!keyStore) {
                    return {
                        code: '',
                        message: 'keyStore error',
                    }
                }   

                // Create token pair
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
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
            console.error(error);
            return {
                code: 'err',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService;