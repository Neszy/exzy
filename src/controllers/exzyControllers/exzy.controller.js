const { connectMongoDB, closeMongoDB } = require("../../configs/database/mongodb");


const testApi = async (req, res) => {
    try {
      connectMongoDB();
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

module.exports = {testApi};