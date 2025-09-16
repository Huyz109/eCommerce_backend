'use strict'

const { consumerToQueue, consumerToQueueNormal, consumerToQueueFailed } = require('./src/services/consumerQueue.service');
const queueName = 'test-topic';

// consumerToQueue(queueName).then(() => {
//     console.log(`Message consumer started ${queueName}`);
// }).catch(console.error)

consumerToQueueNormal(queueName).then(() => {
    console.log(`Message consumerToQueueNormal started`);
}).catch(console.error)

consumerToQueueFailed(queueName).then(() => {
    console.log(`Message consumerToQueueFailed started`);
}).catch(console.error)