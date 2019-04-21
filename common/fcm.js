var admin = require('firebase-admin');

exports.sendMessage = function (title, body, registrationToken) {
    
    // See documentation on defining a message payload.
    var message = {
        notification: {
            title: title,
            body: body
        },
        token: registrationToken
    };    

    // Send a message to the device corresponding to the provided
    // registration token.
    admin.messaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
            return true;
        })
        .catch((error) => {
            console.log('Error sending message:', error);
            return false;
        });
};

exports.sendDataMessage = function (title, body, data, registrationToken) {
    
    // admin.initializeApp({
    //     credential: admin.credential.cert(serviceAccount),
    //     databaseURL: "https://elevator-4d238.firebaseio.com"
    //   });

    // See documentation on defining a message payload.
    data['title'] = title;
    data['body'] = body;
    var message = {
        data: data,
        token: registrationToken
    };
    

    // Send a message to the device corresponding to the provided
    // registration token.
    admin.messaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
};

exports.sendData = function (data, registrationToken) {
    
    // admin.initializeApp({
    //     credential: admin.credential.cert(serviceAccount),
    //     databaseURL: "https://elevator-4d238.firebaseio.com"
    //   });

    // See documentation on defining a message payload.
    var message = {
        data: data,
        token: registrationToken
    };

    // Send a message to the device corresponding to the provided
    // registration token.
    admin.messaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
};

exports.sendTopic = function (title, body, topic) {
    
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://elevator-4d238.firebaseio.com"
      });

    // See documentation on defining a message payload.
    var message = {
        notification: {
            title: title,
            body: body
        },
        topic: topic
    };
    
    // Send a message to devices subscribed to the provided topic.
    admin.messaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
};

exports.subscribe = function (registrationToken, topic) {
    
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://elevator-4d238.firebaseio.com"
      });

    // Subscribe the devices corresponding to the registration tokens to the
    // topic.
    admin.messaging().subscribeToTopic([registrationToken], topic)
    .then(function(response) {
        // See the MessagingTopicManagementResponse reference documentation
        // for the contents of response.
        console.log('Successfully subscribed to topic:', response);
    })
    .catch(function(error) {
        console.log('Error subscribing to topic:', error);
    });
};

exports.unsubscribe = function (registrationToken, topic) {
    
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://elevator-4d238.firebaseio.com"
      });

    // Subscribe the devices corresponding to the registration tokens to the
    // topic.
    admin.messaging().unsubscribeFromTopic([registrationToken], topic)
    .then(function(response) {
        // See the MessagingTopicManagementResponse reference documentation
        // for the contents of response.
        console.log('Successfully subscribed to topic:', response);
    })
    .catch(function(error) {
        console.log('Error subscribing to topic:', error);
    });
};

exports.sendMultiple = function (title, body, registrationTokens) {
    
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://elevator-4d238.firebaseio.com"
      });

    // See documentation on defining a message payload.
    var message = {
        notification: {
            title: title,
            body: body
        }
    };

    // Send a message to the devices corresponding to the provided
    // registration tokens.
    admin.messaging().sendToDevice(registrationTokens, message)
    .then(function(response) {
        // See the MessagingDevicesResponse reference documentation for
        // the contents of response.
        console.log('Successfully sent message:', response);
    })
    .catch(function(error) {
        console.log('Error sending message:', error);
    });
};