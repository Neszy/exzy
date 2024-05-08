require('dotenv').config()
module.exports = {
    ip: process.env.IP,
    port: process.env.PORT,

    // * MONGO DB
    url_mongo: `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/?authSource=${process.env.MONGO_BASE}`,
    url_mongo_localhost:process.env.MONGO_LOCALHOST
}