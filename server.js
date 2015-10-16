var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser  = require('body-parser'),
    routes = require('./routes'),
    config = require('./config');

var mongoConnection = mongoose.connect(config.database);

// Start the server
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
if (!module.parent) {
    app.use(morgan('dev'));
}

app.use('/public',express.static('public_assets'));
app.use('/public/libs',express.static('bower_components'));
app.use('/',routes);

if (!module.parent) {
  var server = app.listen(app.get('port'), function () {
        console.log("Express server listening on port %d in %s mode",
        app.get('port'),
        app.settings.env
      );
    });

    process.on( 'SIGTERM', function () {
       server.close(function () {
         console.log( "Closed out remaining connections.");
         mongoose.disconnect();
       });

       setTimeout( function () {
         console.error("Could not close connections in time, forcefully shutting down");
         process.exit(1);
       }, 30*1000);

    });
}

module.exports = app;
