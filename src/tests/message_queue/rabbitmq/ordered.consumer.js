'use strict';

const amqplib = require('amqplib');

async function consumerOrderedMessage() {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const queueName = 'ordered-queued-message';
    await channel.assertQueue(queueName, {
        durable: true
    });

    // Set prefetch to 1 to ensure ordered processing
    channel.prefetch(1);

    channel.consume(queueName, msg => {
        const message = msg.content.toString();

        setTimeout(() => {
            console.log(`Received message: ${message}`);
            channel.ack(msg);
        }, Math.random() * 1000); // Simulate variable processing time
    });



}

consumerOrderedMessage().catch(console.error);