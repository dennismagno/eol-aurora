const processMessage = require('../helpers/processMessage');
const processFeeds = require('../helpers/processFeeds');
const processPayload = require('../helpers/processPayload');

module.exports = (req, res) => {
    if (req.body.object === 'page') {
        req.body.entry.forEach(entry => {
            if (entry.hasOwnProperty('messaging')) {
                entry.messaging.forEach(event => {
                    console.log(event);
                    if (event.message && event.message.text) {
                        if (event.message.quick_reply && event.message.quick_reply.payload)
                        {
                            processPayload(event);
                        } else {
                            processMessage(event);
                        }
                    }

                    if (event.postback && event.postback.payload == "AURORA_START") 
                    {
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