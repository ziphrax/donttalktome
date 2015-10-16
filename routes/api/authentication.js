var express = require('express'),
    router = new express.Router(),
    authenticationController = require('./../../controllers/authentication'),
    usersController = require('./../../controllers/users');

router.route('/')
    .post(authenticationController.authenticate);
router.route('/new')
    .post(usersController.newUser);

module.exports = router;
