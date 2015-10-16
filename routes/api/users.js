var express = require('express'),
    router = new express.Router()
    usersController = require('./../../controllers/users'),
    authenticator = require('./../../controllers/authenticator');

router.use(authenticator);

router.route('/')
    .get(usersController.getUsers)

router.route('/position')
    .post(usersController.updatePosition);

router.route('/:id')
    .get(usersController.getUser)
    .post(usersController.updateUser)
    .delete(usersController.deleteUser);



module.exports = router;
