'use strict'

const { Created } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {

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