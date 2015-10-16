var userModel = require('./../models/user');

module.exports = {
    getUsers: function(req,res){
        userModel.find({},'name firstName lastName EmailAddress DateOfBirth status created address phone_tel phone_mob phone_work').exec(function(err,docs){
            if(err){
                res.status(500).json({'success': false, 'message': err.message });
            } else {
                res.status(200).json({'success':true, data: docs });
            }
        });
    },
    newUser: function(req,res){
        var newUser = new userModel();

        for(eachkey in req.body){
            newUser[eachkey] = req.body[eachkey];
        }

        newUser.status = 'New';
        newUser.created =  Date.now();

        newUser.save(function(){
            res.json({'success': true, data: [newUser] });
        });
    },
    getUser: function(req,res){
        userModel.findOne({_id:req.params.id},'name firstName lastName EmailAddress DateOfBirth status created address phone_tel phone_mob phone_work').exec(function(err,doc){
            if(err){
                res.status(500).json({'success': false, 'message': err.message });
            } else if (doc) {
                res.json({ 'success':true,'data':[doc] });
            } else {
                res.status(404).json({'success': false, 'message': 'The requested resource does not exist' });
            }
        });
    },
    updateUser: function(req,res){
        userModel.findOne({_id:req.params.id},'name firstName lastName EmailAddress DateOfBirth status created address phone_tel phone_mob phone_work').exec(function(err,doc){
            if(err){
                res.status(500).json({'success': false, 'message': err.message });
            } else if (doc) {

                for(eachkey in req.body){
                    doc[eachkey] = req.body[eachkey]?req.body[eachkey]:doc[eachkey];
                }

                doc.status = req.body.status?req.body.status:doc.status;
                doc.updated =  Date.now();


                doc.save(function(){
                    res.json({'success': true, data: [doc] });
                });
            } else {
                res.status(404).json({'success': false, 'message': 'The requested resource does not exist' });
            }
        });
    },
    deleteUser: function(req,res){
        userModel.findOne({_id:req.params.id} ,'name firstName lastName EmailAddress DateOfBirth status created address phone_tel phone_mob phone_work').exec(function(err,doc){
            if(err){
                res.status(500).json({'success': false, 'message': err.message });
            } else if (doc) {
                doc.remove(function(err){
                    res.status(200).json({'success': true, 'message': 'User Deleted' });
                });
            } else {
                res.status(404).json({'success': false, 'message': 'The requested resource does not exist' });
            }
        });
    },
    updatePosition: function(req,res){
        userModel.findOne({_id:req.decoded._id},'lattitude longitude').exec(function(err,doc){
            if(err){
                res.status(500).json({'success': false, 'message': err.message });
            } else if (doc) {
                doc.location = [req.body.lattitude, req.body.longitude];
                doc.save(function(err){
                    res.status(200).json({'success': true, 'message': 'Position Updated' ,'data':doc});
                });
            } else {
                res.status(404).json({'success': false, 'message': 'The requested resource does not exist.' });
            }
        });
    }
}
