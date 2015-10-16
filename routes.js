var express = require('express'),
    router = new express.Router()
    path = require('path'),
    indexRouter = require('./routes/index'),
    setupRouter = require('./routes/setup'),
    apiRouter = require('./routes/api');

router.use('/',indexRouter);
router.use('/setup',setupRouter);
router.use('/api/v1',apiRouter);


module.exports = router;
