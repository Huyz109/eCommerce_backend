'use strict'
const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findByUserId } = require('../services/keytoken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'refreshtoken'
}

const createTokenPair = async(payload, publicKey, privateKey) => {
    try {
        // Access token
        const accessToken = await JWT.sign(payload, publicKey, {
            // algorithm: 'RS256',
            expiresIn: '2 days'
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            // algorithm: 'RS256',
            expiresIn: '7 days'
        });

        // 
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if(err) {
                console.error(`Error verify: `, err)
            }
            else {
                console.log(`Decode verify: `, decode)
            }
        })

        return {accessToken, refreshToken};
    } catch (error) {
        console.error(error);
        return error
    }
}

const authenticationV2 = asyncHandler(async (req, res, next) => {
    // Check userId missing
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) {
        throw new AuthFailureError('Invalid Request')
    }

    // Get accessToken
    const keyStore = await findByUserId(userId)  
    if(!keyStore) throw new NotFoundError('Not found keyStore')

    if(req.headers[HEADER.REFRESHTOKEN]){
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]
            const decodeUser = JWT.verify(refreshToken, keyStore.publicKey)
            if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid user')   
            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next()
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invalid Request')
    // Verify token
    // Check user in database
    // Check keyStore with userId
    // Return next
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid user')       
        req.keyStore = keyStore;
        req.user = decodeUser
        return next()
    } catch (error) {
        console.log(error)
        throw error
    }

})

const verifyJWT = async(token, keySecret) => {
    return await JWT.verify(token, keySecret);
}

module.exports = {
    createTokenPair,
    authenticationV2,
    verifyJWT
}