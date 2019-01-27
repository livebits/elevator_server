'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module) {
    //app.start();
    app.socketServer = require('socket.io')(app.start());
    // require('socketio-auth')(app.socketServer, {
    //     authenticate: function (socket, value, callback) {
                    
    //       if(value.userToken === undefined || value.userId === undefined) {
    //         return callback(null, false);
    //       }
          
    //       var AccessToken = app.models.MyAccessToken;
    //       //get credentials sent by the client
    //       var token = AccessToken.find({
    //         where:{
    //           and: [{ userId: value.userId }, { id: value.userToken }]
    //         }
    //       }, function(err, tokenDetail){
    //         if (err) throw err;
                    
    //         if(tokenDetail.length){

    //           //save in db
    //           app.models.socketModel.create({
    //             principalType: tokenDetail[0].principalType,
    //             userId: value.userId,
    //             userToken: value.userToken,
    //             socketId: socket.id
    //           }, function (err, newSocket) {
    //             if(err) console.log(err);
                
    //             console.log(tokenDetail[0].principalType,' \'',value.userId,'\'  was connected' );
                                
    //           });

    //           callback(null, true);
    //         } else {
    //           callback(null, false);
    //         }
    //       }); //find function..    
    //     },
    //     postAuthenticate: function (socket, data) {
    //       // console.log(data);
          
    //     },
    //     disconnect: function (socket) {
    //       // console.log(socket.id + ' disconnected');
    //     }
    // });

    app.socketServer.on('connection', function(socket){
     
      console.log('user connected ->', socket.id);

      //when client is diconnected
      socket.on('disconnect', function(){
        console.log('user disconnected ' + socket.id);
      });

      socket.on('data', function (value) {
        console.log('data: ', value);
      });
    });
  }
});

// app.middleware('auth', loopback.token());

app.use(loopback.token({
  model: app.models.MyAccessToken
}));