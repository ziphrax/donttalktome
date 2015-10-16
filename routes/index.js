var express = require('express'),
    router = new express.Router()
    indexController = require('../controllers/index');
var config = require('./../config');

router.route('/').get(indexController.index);

module.exports = router;
