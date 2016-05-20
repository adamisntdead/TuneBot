// Requires
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var path = require('path');
var cheerio = require("cheerio");

// Variables
var results = {};
var endUrl = "";


// Init & Setup Modules / Express
var app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

// Make a sentance from array
function arrayToSentence(arr) {
    var last = arr.pop();
    return arr.join(', ') + ' and ' + last;
}

// Remove Special Charachters from Results
function htmlSpecialChars(text) {
 
  return text
  .replace(/&apm;/g, "&")
  .replace(/&quot;/g, '"')
  .replace(/&#039;/g, "'")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">");
 
}

// Choose Reply
function chooseWSongReply(tune, output) {
    var replys = ["Oh that tune, " + tune + "! Yeah, I think I know what one your talking about, try playing " + output + "with that tune... my Instinct tells me it will be good!",
    "I think you could play " + output + " with " + tune + " and it would go well... you\'ll have to make sure yourself though!", "Oh I think I know what tune your taking about... " + tune + ", Yeah? Well I would try... " + output +"? Well, thats my opinion anyway"];
    var numReplys = replys.length + 1;
	var randomNumber = Math.floor(Math.random() * numReplys);
	return replys[randomNumber];

}

// Get Song Function
function getSong(url, sendTo) {
    var uri = 'https://thesession.org/tunes/search?q=' + url + '&format=json';
    var res = encodeURI(uri);
    var tuneName = "Unknown";

    request(res, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            results = JSON.parse(body);
            if (results.pages == 0) {
                sendMessage(sendTo, {
                    text: "Sorry! I don't know what tune you are talking about! Make sure there is no spelling mistakes, and you are using the correct name for the tune!"
                });
            }
            else {
                endUrl = results.tunes[0].url;
                tuneName = htmlSpecialChars(results.tunes[0].name);
                console.log(endUrl);
                request(endUrl, function(error, response, body) {
                    if (!error) {
                        var $ = cheerio.load(body);
                        // playedwith = $(".info a").html();
                        var playedwith = "";
                        var tunes = [];
                        $('.info a').each(function(i, elem) {
                            tunes[i] = $(this).text();
                        });

                        var sentance = arrayToSentence(tunes);
                        playedwith = htmlSpecialChars(sentance);

                        console.log(playedwith);
                        if (tunes[0] == null || tunes[0] == "" || tunes[0] == " ") {
                            sendMessage(sendTo, {
                                text: "Hmmm... You got me there, I'm not quite sure what you could play with " + tuneName
                            });
                        }
                        else {
                            var reply = chooseWSongReply(tuneName, playedwith);
                            sendMessage(sendTo, {
                                text: reply
                            });
                        }
                    }
                    if (error) {
                        console.log("We’ve encountered an error: " + error);
                    }
                });
            }
        }
    });

}


// Serve our Index Page 
app.get('/', function(req, res) {
    var fileName = path.join(__dirname, 'site/index.html');

    // Sends the file
    res.sendFile(fileName, function(err) {

        // Handle Error
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        else {
            console.log('Sent:', fileName);
        }
    });
});

// Facebook Webhook
app.get('/webhook', function(req, res) {
    if (req.query['hub.verify_token'] === 'verifytune') {
        res.send(req.query['hub.challenge']);
    }
    else {
        res.send('Invalid verify token');
    }
});

// handler receiving messages
app.post('/webhook', function(req, res) {
    var events = req.body.entry[0].messaging;
    for (var i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            if (event.message.text == "Hey" || event.message.text == "hey" || event.message.text == "hi" || event.message.text == "Hi" || event.message.text == "hello" || event.message.text == "Hello" || event.message.text == "Hey!" || event.message.text == "hey!" || event.message.text == "hi!" || event.message.text == "Hi!" || event.message.text == "hello!" || event.message.text == "Hello!") {
                sendMessage(event.sender.id, {
                    text: "Hello! My name is TuneBot! To get started, try just telling me the name of your favourite tune! if I get it wrong, Make sure your spelling is correct, and that you are using the propper name for the tune! If you need more help, just say 'Help'"
                });
            }
            else if (event.message.text == "Help" || event.message.text == "help") {
                sendMessage(event.sender.id, {
                    text: "Sorry your having trouble! If I am not getting your tune, the most you can do is make sure you are putting in the name correctly... try again, and if it doesnt work, just email adam@adamkellydesign.com"
                });
            }
            else {
                getSong(event.message.text, event.sender.id);

            }
        }
    }
    res.sendStatus(200);
});


// generic function sending messages
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: process.env.PAGE_ACCESS_TOKEN
        },
        method: 'POST',
        json: {
            recipient: {
                id: recipientId
            },
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        }
        else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}
