'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var admin = require('firebase-admin');

var serviceAccount = require('./elevator-d6820-firebase-adminsdk-k5fa8-548a2c163c.json');

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

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://elevator-d6820.firebaseio.com"
      });
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
        var parts = value.split(',');
        var errorNames = [];

        parts.forEach((part, index) => {
          for (var i = (part.length - 1); i >= 0; i--) {
            
            if(part.charAt(i) === "1") {
              errorNames.push(getCodeName(index, (part.length - i)));
            }
          }
        });

        console.log('data: ', errorNames);
        app.socketServer.emit('check', errorNames.join(' - '));
      });

      function getCodeName(index, i) {
        switch (index) {
          case 0:
            switch (i) {
              case 1:
                return 'FTO';
              case 2:
                return 'FIR';
              case 3:
                return 'Break';
              case 4:
                return '110';
              case 5:
                return '71';
              case 6:
                return '66';
              case 7:
                return '69';  
              case 8:
                return '68';
              default:
                break;
            }
            break;
          
          case 1:
            switch (i) {
              case 1:
                return '1CF';
              case 2:
                return 'CF3';
              case 3:
                return 'CA1';
              case 4:
                return 'CAN';
              case 5:
                return 'EC1';
              case 6:
                return 'ECN';
              default:
                break;
            }
            break;

          case 2:
            switch (i) {
              case 1:
                return 'R input';
              case 2:
                return 'S input';
              case 3:
                return 'T input';
              case 4:
                return 'U1 output';
              case 5:
                return 'V1 output';
              case 6:
                return 'W1 output';
              case 7:
                return 'U2 output';
              case 8:
                return 'V2 output';
              default:
                break;
            }
            break;

          case 3:
            switch (i) {
              case 1:
                return 'W2 output';
              case 2:
                return 'Door error';
              case 3:
                return 'contact error';
              case 4:
                return 'Emergency';
              case 5:
                return 'cant calibration';
              case 6:
                return 'jump door';
              case 8:
                return 'control phase';
              default:
                break;
            }
            break;

          case 4:
            switch (i) {
              case 1:
                return 'CA1 larzesh';
              case 2:
                return 'CAN larzesh';
              case 3:
                return 'EC1 larzesh';
              case 4:
                return 'ECN larzesh';
              case 5:
                return 'CF1 larzesh';
              case 6:
                return 'CF3 larzesh';
              default:
                break;
            }
            break;
        
          default:
            break;
        }
      }
    });
  }
});

// app.middleware('auth', loopback.token());

app.use(loopback.token({
  model: app.models.MyAccessToken
}));