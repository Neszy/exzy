var express = require('express');
const router = express.Router();
const service = require('../../controllers/exzyControllers/exzy.controller')
const mongo = require('../../controllers/mongoControllers/mongo.controllers')

 router.post('/test-api', service.testApi)
 router.post('/created-mongo-db', mongo.createdTable)
 router.post('/add-data-mongo-db',mongo.addDataFormXlsx)
 router.post('/get-data-mongo-db',mongo.getDataMongoAggregation)
 router.post('/export-data-csv',mongo.getDataMongoAggregationAndExport)

 
module.exports = router;
