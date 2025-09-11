'use strict'

const { connectToRabbitMQForTest } = require('../dbs/init.rabbit');

describe('RabbitMQ connection', () => {
    it('Should connect successfully to RabbitMQ', async () => {
        const result = connectToRabbitMQForTest();
        expect(result).toBeUndefined
    })
})