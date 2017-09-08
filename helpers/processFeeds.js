const FACEBOOK_ACCESS_TOKEN = 'EAABmovau6lkBAE04GzhgftRk1kA4FZAeggl1ZCZCso6csHZBmKVrlHpxPWNkyGdw41NssErIDYgZCPk1XPBIZCUiPWoJLsxhYulmLqJ8AYm7lZCtRBVIwhfWOMp1YeX8XLgy8dvXEV0CqGiLNA0BH6aqXeZCZAVCTZBn3AlOEigjRbogKNukWWd8Wh';

const request = require('request');

module.exports = (event) => {
    const commentId = event.value.comment_id;
    const message = "Hello world!";

    request({
        uri: 'https://graph.facebook.com/v2.9/' + commentId + '/private_replies',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: message
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        } else {
            console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
        }
    });
};