"use strict";

const amqp = require("amqplib");

const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect("amqp://guest:12345@localhost");
        if (!connection) throw new Error("Connection not established");

        const channel = await connection.createChannel();

        return { channel, connection };
    } catch (error) {
        console.error(error);
    }
};

const connectToRabbitMQForTest = async () => {
    try {
        const { channel, connection } = await connectToRabbitMQ();

        // Publish a message to queue
        const queue = "test-queue";
        const message = "Hello Rabbit";

        await channel.assertQueue(queue);
        await channel.sendToQueue(queue, Buffer.from(message));

        // Close connection
        await connection.close();
    } catch (error) {
        console.error("Error connecting to rabbit MQ: ", error);
    }
};

module.exports = { connectToRabbitMQ, connectToRabbitMQForTest };
