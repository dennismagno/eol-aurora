const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const PAGE_ACCESS_TOKEN = 'EAABmovau6lkBAKoYzZAFjZBzQzX5R1uuWdXeQmwKk4OQjgnmlcPvZCbPlsXKRKDfkoNpygubA50FhfVC6UL7cvC4fECOxKgTgWhSK2nCBBb2X4aVztk44D8wTzJZBhumFAHEjw8ucaOTCBunifWmyJStjabNT8tJeBtuRvvsbQZDZD';

const app = express();

const verificationController = require('./controllers/verification');
const messageWebhookController = require('./controllers/messageWebhook');
const imageSearchController = require('./controllers/imageSearch');

var port = 5555;//process.env.PORT || 8080;

var path = require('path');

app.use(express.static(path.resolve('./public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function setGreetingText() {
    var greetingData = {
        setting_type: "greeting",
        greeting:{
                    text:"Hi {{user_first_name}}, welcome!"
                }
    };

    createGreetingApi(greetingData);
    setupGetStartedButton();
}

function createGreetingApi(data) {
    request({
    uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: { access_token: PAGE_ACCESS_TOKEN },
            method: 'POST',
            json: data 
        }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("Greeting set successfully!");
        } else {
            console.error("Failed calling Thread Reference API", response.statusCode,  response.statusMessage, body.error);
        }
    });
}

function setupGetStartedButton(){
        var messageData = {
                get_started:[
                {
                    payload:"USER_DEFINED_PAYLOAD"
                    }
                ]
        };

        // Start the request
        request({
            url: 'https://graph.facebook.com/v2.6/messenger_profile?access_token='+ PAGE_ACCESS_TOKEN,
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            form: messageData
        });
    }  

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
    setGreetingText();
});

app.get('/', verificationController);
app.post('/', messageWebhookController);
app.post('/image-search', imageSearchController);