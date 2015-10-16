var friendModel = require('./../models/friend');
var userModel = require('./../models/user');
var config = require('./../config');
var nodemailer  = require("nodemailer");
var node_env = process.env.NODE_ENV || 'development';
if(node_env == "development"){
  var stubTransport = require('nodemailer-stub-transport');
  var transporter = nodemailer.createTransport(stubTransport());
} else {
  var smtpTransport = require('nodemailer-smtp-transport');
  var transporter = nodemailer.createTransport("SMTP",{
     port: config.smtpPort,
     secure: false,
     ignoreTLS: true
   });
 }

module.exports = {
    makeFriends: function(req,res){
        userModel.findOne({_id:req.body.to_user_id}).exec(function(err,doc){
            if(err){
                res.status(500).json({'success': false, 'message': err.message });
            } else if (doc){
                transporter.sendMail({
                  from: 'sender@address',
                  to: 'receiver@address',
                  subject: 'New Friends Request!',
                  text: 'New Friends Request.'
                },function(err,message){
                    if(err && node_env != "development"){
                        res.status(500).json({'success': false, data: err });
                    } else {
                        var friends = new friendModel();
                        friends.to_user_id = req.body.to_user_id;
                        friends.from_user_id = req.decoded._id;
                        friends.sent = Date.now();
                        friends.accepted = false;
                        friends.save(function(err){
                            res.json({'success': true, data: [friends] });
                        });
                    }
                  });
            } else {
                res.status(404).json({'success': false, 'message': 'The requested resource does not exist' });
            }
        });
    },
    getFriends: function(req,res){
        friendModel.find({$or: [{from_user_id: req.params.id},{to_user_id: req.params.id}]}).exec(function(err,docs){
            if(err){
                res.status(500).json({'success': false, data: err });
            } else if (docs){
                res.json({'success': true, data: [docs] });
            } else {
                res.status(404).json({'success': false, 'message': 'The requested resource does not exist' });
            }
        });
    },
    getNearest: function(req,res){
        userModel.findOne({_id:req.decoded._id}).exec(function(err,doc){
            if(!req.body.maxDistance){
                req.body.maxDistance = 1;
            }
            if(err){
                res.status(500).json({'success': false, data: err });
            } else if (doc){
                userModel
                    .find({ location: {'$near': doc.location , '$maxDistance': req.body.maxDistance} },'name location')
                    .limit(10)
                    .exec(function(err, docs) {
                        res.status(200).json({'success': true, 'maxDistance':req.body.maxDistance, 'data': [docs] });
                    });
            } else {
                res.status(404).json({'success': false, 'message': 'The requested resource does not exist' });
            }
        });

    }
}
