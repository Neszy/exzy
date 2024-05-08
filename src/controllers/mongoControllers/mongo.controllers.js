const { connectMongoDB, closeMongoDB } = require("../../configs/database/mongodb");


const createdTable = async (req, res) => {
    try {
        const { name_collection,name_database } = req.body;
        if (!name_collection) {
            return res.status(400).json({ error: 'Missing name_collection in request body' });
        }
        const client = await connectMongoDB(); 
        await client.db(name_collection);
        await client.db(name_collection).createCollection(name_database);

        return res.status(201).json({
            "request_id": '',
            "code": 200,
            "message": "OK: The request was successful.",
            "data": ''
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error creating' });
    }
};


module.exports = {createdTable};