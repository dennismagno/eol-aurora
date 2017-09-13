const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const verificationController = require('./controllers/verification');
const messageWebhookController = require('./controllers/messageWebhook');
const imageSearchController = require('./controllers/imageSearch');

var port = process.env.PORT || 8080;

var path = require('path');

app.use(express.static(path.resolve('./public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});

app.get('/', verificationController);
app.post('/', messageWebhookController);
app.post('/image-search', imageSearchController);