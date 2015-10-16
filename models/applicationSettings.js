var ApplicationSettings = require('./../models/applicationSettings');
var User = require('./../models/user');

function runSetup(req,res,next){
    var adminUser = new User({
        name: 'Administrator',
        password: 'Admin',
        admin: true
    });

    adminUser.save(function(err){
        if(err) {
            console.log(err);
        } else {
            console.log('Admin user created successfully');
            var settings = new ApplicationSettings();
            settings.setupHasRun = true;
            settings.save(function(err){
                res.json({ success: true, message: 'Admin user created successfully', user_id: adminUser._id});
            });
        }
    });

}

module.exports = {
    setup : function(req,res,next){
        ApplicationSettings.findOne({}).exec(function(err,doc){
            if(doc && doc.setupHasRun){
                res.status(404).sendFile(path.resolve('views/404.htm'));
            } else {
                runSetup(req,res,next);
            }
        });
    },

};
