const { MongoClient } = require('mongodb');
const config = require('../../configs/app');
const mongoose = require('mongoose');

// const uri = config.make_url_mongo;
const url= config.url_mongo_localhost //config.url_mongo_localhost;

let client = null;
let connectionPromise = null;

async function connectMongoDB() {
    try {
      if (!client) {
        client = await MongoClient.connect(url);
        console.log('Connect MongoDB success');
      } else if (connectionPromise) {
        await connectionPromise;
      }
      return client; 
    } catch (err) {
      console.error('Failed to connect to MongoDB:', err.message);
      process.exit(1);
    }
  }

async function closeMongoDB() {
  if (client) {
    await client.close();
    client = null;
    connectionPromise = null;
    console.log('Disconnected from MongoDB');
  }
  // Disconnect Mongoose
  await mongoose.disconnect();
}

module.exports = {
  connectMongoDB,
  closeMongoDB,
};


