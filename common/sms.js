var http = require("http");
var qs = require("querystring");
// var speakeasy = require('speakeasy');
// var app = require('../server/server');

exports.sendVerificationCode = function (phoneNumber, code) {

    getToken(phoneNumber, code, 'verification');
};

//send message
exports.sendMessage = function (phoneNumbers, message) {

    getToken(phoneNumbers, message, 'message');
};

getToken = function (param1, param2, type) {

    var post_data = JSON.stringify({
        "UserApiKey":"abf992081ca92cc9e2ff9208",
        "SecretKey":"boxit@atria#2017"
    });
    var options = {
        "method": "POST",
        "hostname": "RestfulSms.com",
        "path": "/api/Token",
        "headers": {
            "content-type": "application/json; charset=utf-8",
            "Content-Length": Buffer.byteLength(post_data)
        }
    };

    try {
        var req = http.request(options, function (response) {

            var chunks = [];
            response.on("data", function (chunk) {
                try {
                    chunks.push(chunk);
                } catch (er) {
                    console.log("sendSmsError2: " + JSON.stringify(er));
                }
            });

            response.on("end", function () {
                try {
                    var body = Buffer.concat(chunks);
                    
                    if(type === 'verification'){
                        sendCode(body, param1, param2);
                    } else if(type === 'message'){
                        sendPortalMessage(body, param1, param2);
                    }
                } catch (er) {
                    console.log("sendSmsError3: " + JSON.stringify(er));
                }
            });
        });
        req.write(post_data);
        req.end();
    }
    catch (er) {
        console.log("sendSmsError4: " + JSON.stringify(er));
    }
};

sendCode = function(body, phoneNumber, code) {
    var body = JSON.parse(body);
    var token = body.TokenKey;

    var data = JSON.stringify({
        "Code": code,
        "MobileNumber": phoneNumber
    });

    var option = {
        "method": "POST",
        "hostname": "RestfulSms.com",
        "path": "/api/VerificationCode",
        "headers": {
            "content-type": "application/json; charset=utf-8",
            "Content-Length": Buffer.byteLength(data),
            "x-sms-ir-secure-token": token
        }
    };
    var req2 = http.request(option, function (res) {

        var chunks2 = [];
        res.on("data", function (chunk) {
            try {
                chunks2.push(chunk);

            } catch (er) {
                console.log("sendSmsError5: " + JSON.stringify(er));
            }
        });

        res.on("end", function () {
            try {
                var body = Buffer.concat(chunks2);
                console.log(body.toString());

            }
            catch (er) {
                console.log("sendSmsError6: " + JSON.stringify(er));
            }
        });
    });
    req2.write(data);
    req2.end();
};

sendPortalMessage = function(body, phoneNumbers, message) {
    var body = JSON.parse(body);
    var token = body.TokenKey;

    var data = JSON.stringify({
        "Messages":[message],
        "MobileNumbers": phoneNumbers,
        "LineNumber": "50002015398839",
        "SendDateTime": "",
        "CanContinueInCaseOfError": "true",
    });

    var option = {
        "method": "POST",
        "hostname": "RestfulSms.com",
        "path": "/api/MessageSend",
        "headers": {
            "content-type": "application/json; charset=utf-8",
            "Content-Length": Buffer.byteLength(data),
            "x-sms-ir-secure-token": token
        }
    };
    var req2 = http.request(option, function (res) {

        var chunks2 = [];
        res.on("data", function (chunk) {
            try {
                chunks2.push(chunk);

            } catch (er) {
                console.log("sendSmsError5: " + JSON.stringify(er));
            }
        });

        res.on("end", function () {
            try {
                var body = Buffer.concat(chunks2);
                console.log(body.toString());

            }
            catch (er) {
                console.log("sendSmsError6: " + JSON.stringify(er));
            }
        });
    });
    req2.write(data);
    req2.end();
};