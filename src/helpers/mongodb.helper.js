const { connectMongoDB } = require("../configs/database/mongodb");

const methods = {
    async create(collectionName, data) {
        const connectedClient = await connectMongoDB();
        const database = connectedClient.db("ptt_db");
        const collection = database.collection(collectionName);
        const result = await collection.insertOne(data);
        return result.insertedId;
    },

    async read(collectionName, query) {
        const db = await connectMongoDB();
        const database = db.db("ptt_db");
        const collection = database.collection(collectionName);
        const documents = await collection.find(query).toArray();
        return documents;
    },

    async update(collectionName, query, updateData) {
        const db = await connectMongoDB();
        const collection = db.collection(collectionName);
        const result = await collection.updateMany(query, { $set: updateData });
        return result.modifiedCount;
    },

    async delete(collectionName, query) {
        const db = await connectMongoDB();
        const collection = db.collection(collectionName);
        const result = await collection.deleteMany(query);
        return result.deletedCount;
    }
};

module.exports = { ...methods };
