const processMessage = require('../helpers/processMessage');
const processFeeds = require('../helpers/processFeeds');

module.exports = (req, res) => {
    if (req.body.object === 'page') {
        req.body.entry.forEach(entry => {
            if (entry.hasOwnProperty('messaging')) {
                entry.messaging.forEach(event => {
                    if (event.message && event.message.text) {
                        processMessage(event);
                    }
                });
            }

            if (entry.hasOwnProperty('changes')) {
                entry.changes.forEach(event => {
                    if (event.field == "feed" && event.value.item == "comment" && event.value.verb == "add") {
                        //processFeeds(event);
                        console.log(event);
                    }
                });
            }
        });

        res.status(200).end();
    }
};