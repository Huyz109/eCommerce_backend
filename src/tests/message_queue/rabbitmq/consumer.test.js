const amqplib = require('amqplib');

const runConsumer = async () => {
    try {
        const connection = await amqplib.connect('amqp://guest12345@localhost');
        const channel = await connection.createChannel();

        const queueName = 'test-topic';
        await channel.assertQueue(queueName, {
            durable: true
        });

        // Receive message
        channel.consume(queueName, (message) => {
            console.log(`Receive ${message.content.toString()}`)
        }, {
            noAck: true
        })
    } catch (error) {
        console.error(error);
    }
}

runConsumer().catch(console.error);
