var User = require('./../models/user');
var config = require('./../config');
var jwt = require('jsonwebtoken');

module.exports = {
    authenticate: function(req,res,next){
        User.findOne({name: req.body.name},'name password EmailAddress admin').exec(function(err,user){
            if (err) throw err;
            if (!user) {
              res.status(401).json({ success: false, message: 'Authentication failed.' });
            } else if (user) {

              // check if password matches
              if (user.password != req.body.password) {
                res.status(401).json({ success: false, message: 'Authentication failed.' });
              } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, config.secret, {
                  expiresIn: 14400 // expires in 24 hours
                });

                // return the information including token as JSON
                res.status(200).json({
                  success: true,
                  message: 'Enjoy your token!',
                  token: token
                });
              }
            }
        });
    }
}
