'use strict'

const { Types } = require("mongoose");
const keyTokenModel = require("../models/keytoken.model");
 
class KeyTokenService {
    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
        try {
            // Lv0
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })
            // return tokens ? tokens.publicKey : null;

            const filter = {user: userId}, update = {
                publicKey, privateKey, refreshTokenUsed: [], refreshToken
            }, options = {upsert: true, new: true}
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            console.log(error)
            return error
        }
    }

    static findByUserId = async(userId) => {
        return await keyTokenModel.findOne({user: new Types.ObjectId(userId)}).lean()
    }

    static removeKeyById = async(id) => {
        return await keyTokenModel.deleteOne({_id: new Types.ObjectId(id)}) 
    }
}

module.exports = KeyTokenService;