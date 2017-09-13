const processMessage = require('../helpers/processMessage');
const processFeeds = require('../helpers/processFeeds');

module.exports = (req, res) => {
    console.log(req);
    if (req.body.object === 'page') {
        req.body.entry.forEach(entry => {
            if (entry.hasOwnProperty('messaging')) {
                entry.messaging.forEach(event => {
                    if (event.message && event.message.text) {
                        processMessage(event);
                    }

                    if (event.postback && event.postback.payload) {
                        processPayload(event);
                    }
                });
            }

            if (entry.hasOwnProperty('changes')) {
                entry.changes.forEach(event => {
                    console.log(event);
                    if (event.field == "feed" && event.value.item == "comment" && event.value.verb == "add") {
                        processFeeds(event,0);
                    }

                    if (event.field == "feed" && event.value.reaction_type == "like" && event.value.verb == "add") {
                        processFeeds(event,1);
                    }
                });
            }
        });

        res.status(200).end();
    }
};