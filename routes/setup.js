var express = require('express'),
    router = new express.Router(),
    setupController = require('../controllers/setup');

//only used to set up the application
router.route('/').get(setupController.setup);

module.exports = router
