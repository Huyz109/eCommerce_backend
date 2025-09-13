'use strict'

const mongoose = require('mongoose');
const connectString = 'mongodb://localhost:27017/dbDev'

const TestSchema = new mongoose.Schema({ name: String })
const Test = mongoose.model('test', TestSchema);

describe('Mongoose Connection', () => {
    let connection;

    beforeAll(async () => {
        connection = await mongoose.connect(connectString);
    })

    // Close the connection
    afterAll(async () => {
        await connection.disconnect();
    })

    it('should create to mongoose', () => {
        expect(mongoose.connection.readyState).toBe(1)
    })

    it('should save a document to the database', async () => {
        const user =  new Test({ name: "Abc" });
        await user.save();
        expect(user.isNew).toBe(false);
    })

    it('should find a document in database', async () => {
        const user =  await Test.findOne({ name: "Abc" })
        expect(user).toBeDefined();
        expect(user.name).toBe("Abc");
    })
})
