'use strict';

const { consumerQueue, connectToRabbitMQ } = require('../dbs/init.rabbit');

const messageService = {
    consumerToQueue: async (queueName) => {
        try {
            const { channel } = await connectToRabbitMQ();
            await consumerQueue(channel, queueName);
        } catch (error) {
            console.error("Error consumer queue: ", error);
        }
    },
    // Case processing
    consumerToQueueNormal: async (queueName) => {
        try {
            const { channel, connection } = await connectToRabbitMQ();

            const notiQueue = 'notificationQueue'; // assertQueue

            // 1. TTL
            // const timeExpried = 15000;
            // setTimeout(() => {
            //     channel.consume(notiQueue, msg => {
            //         console.log("Send noti queue successfully: ", msg.content.toString());
            //         channel.ack(msg);
            //     })
            // }, timeExpried);

            // 2. Logic failed
            channel.consume(notiQueue, msg => {
                try {
                    const numberTest = Math.random();

                    if (numberTest < 0.8) {
                        throw new Error("Send notification failed: HOT FIX")
                    }
                    console.log("Send noti queue successfully: ", msg.content.toString());
                    channel.ack(msg);
                } catch (error) {
                    // console.error("Send notification error: ", error);
                    channel.nack(msg, false, false);
                }
            })
        } catch (error) {
            console.error(error);
        }
    },

    // Case failed
    consumerToQueueFailed: async (queueName) => {
        try {
            const { channel, connection } = await connectToRabbitMQ();

            const notificationExchangeDLX = 'notificationExDLX'; // notificationEx direction
            const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'; // assert
            const notiQueueHandlder = 'notificationQueueHotFix';

            await channel.assertExchange(notificationExchangeDLX, 'direct', {
                durable: true
            });

            const queueResult = await channel.assertQueue(notiQueue, {
                exclusive: false,
            });

            await channel.bindQueue(queueResult.queue, notificationExchangeDLX, notificationRoutingKeyDLX);

            await channel.consume(queueResult.queue, msgFailed => {
                console.log("This notification error, please hot fix: ", msgFailed.content.toString());
            }, {
                noAck: true
            })

        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

module.exports = messageService;