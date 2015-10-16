var express = require('express'),
    router = new express.Router()
    authenticationRoute = require('./api/authentication'),
    friendsRoute = require('./api/friends'),
    usersRoute = require('./api/users'),

router.use('/authentication',authenticationRoute);
router.use('/friends',friendsRoute);
router.use('/users',usersRoute);

module.exports = router;
