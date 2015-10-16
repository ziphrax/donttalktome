var express = require('express'),
    router = new express.Router()
    friendsController = require('./../../controllers/friends'),
    authenticator = require('./../../controllers/authenticator');

router.use(authenticator);

router.route('/nearest').get(friendsController.getNearest);
router.route('/:id').get(friendsController.getFriends);
router.route('/makeFriends').post(friendsController.makeFriends);


module.exports = router;
