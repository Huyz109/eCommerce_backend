'use strict'

const Notification = require("../models/notification.model");

const pushNotiToSystem = async ({ type = "SHOP-001", receiverId = 1, senderId = '1', options = {} }) => {
    let noti_content;
    if (type === "SHOP-001") {
        noti_content = "&&& vua moi them 1 san pham: @@@@"
    }
    else if (type === "PROMOTION-001") {
        noti_content = "&&& vua moi them 1 voucher: @@@@"
    }

    const newNoti = await Notification.create({
        noti_type: type,
        noti_content,
        noti_senderId: senderId,
        noti_receiverId: receiverId,
        noti_options: options
    });

    return newNoti;
}

const listNotiByUser = async ({ userId = 1, type = "ALL", isRead = 0 }) => {
    const match = { noti_receiverId: userId };
    if (type !== 'ALL') {
        match['noti_type'] = type
    };

    return await Notification.aggregate([
        {
            $match: match
        },
        {
            $project: {
                noti_type: 1,
                noti_senderId: 1,
                noti_receiverId: 1,
                noti_content: {
                    $concat: [
                        {
                            $substr: ['$noti_options.shop_name', 0, -1]
                        },
                        ' vua moi them 1 san pham moi: ',
                        {
                            $substr: ['$noti_options.product_name', 0, -1]
                        }
                    ]
                },
                noti_options: 1,
                createdAt: 1,
            }
        }
    ])
}

module.exports = {
    pushNotiToSystem,
    listNotiByUser
}