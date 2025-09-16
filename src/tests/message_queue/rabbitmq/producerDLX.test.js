const amqplib = require('amqplib');
const message = "Hello RabbitMQ";

const log = console.log;

console.log = () => {
    log.apply(console, [new Date()].concat(arguments));
}

const runProducer = async () => {
    try {
        const connection = await amqplib.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const notificationExchange = 'notificationEx'; // notification direction
        const notiQueue = 'notificationQueue'; // assertQueue
        const notificationExchangeDLX = 'notificationExDLX'; // notificationEx direction
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'; // assert

        // Create exchange
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true
        });

        // Create queue 
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false,
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX
        });

        // BindQueue
        await channel.bindQueue(queueResult.queue, notificationExchange);

        // Send message
        const msg = 'A new product';
        console.log("Product msg: ", msg);
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: 10000 // ms
        });

        setTimeout(() => {
            connection.close();
            process.exit();
        }, 500)

    } catch (error) {
        console.error(error);
    }
}

runProducer().catch(console.error);
