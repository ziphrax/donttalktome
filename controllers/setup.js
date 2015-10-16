var ApplicationSettings = require('./../models/applicationSettings');
var User = require('./../models/user');

module.exports = {
    setup : function(req,res,next){
        var adminUser = new User({
            name: 'Administrator',
            password: 'Admin',
            admin: true,
            location: [5,5]
        });

        adminUser.save(function(err){
            if(err) {
                console.log(err);
            } else {
                console.log('Admin user created successfully');
                res.status(200).send('OK');
            }
        });
    }

};
