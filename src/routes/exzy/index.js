var express = require('express');
const router = express.Router();
const service = require('../../controllers/exzyControllers/exzy.controller')
const mongo = require('../../controllers/mongoControllers/mongo.controllers')

 router.post('/test-api', service.testApi)
 router.post('/created-mongo-db', mongo.createdTable)

module.exports = router;
