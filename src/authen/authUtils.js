'use strict'
const JWT = require('jsonwebtoken');

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

module.exports = {
    createTokenPair
}