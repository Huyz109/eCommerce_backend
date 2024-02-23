'use strict'

const { Created, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
    login = async(req, res, next) => {
        console.log(`[P]:::login`, req.body);
        new SuccessResponse({
            message: 'Login success',
            metadata: await AccessService.login(req.body)
        }).send(res)
    }

    signUp = async(req, res, next) => {
        console.log(`[P]:::signUp`, req.body);
        new Created({
            message: 'Registered OK',
            metadata: await AccessService.signUp(req.body)
        }).send(res)
        // return res.status(200).json(await AccessService.signUp(req.body));
    }
}

module.exports = new AccessController();