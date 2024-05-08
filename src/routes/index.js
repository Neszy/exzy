const router = require('express').Router()
const config = require('../configs/app')

router.use(`/api/exzy/` ,require('./exzy/index'))

module.exports = router