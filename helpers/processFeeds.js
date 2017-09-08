const FACEBOOK_ACCESS_TOKEN = 'EAABmovau6lkBAE04GzhgftRk1kA4FZAeggl1ZCZCso6csHZBmKVrlHpxPWNkyGdw41NssErIDYgZCPk1XPBIZCUiPWoJLsxhYulmLqJ8AYm7lZCtRBVIwhfWOMp1YeX8XLgy8dvXEV0CqGiLNA0BH6aqXeZCZAVCTZBn3AlOEigjRbogKNukWWd8Wh';

const request = require('request');



const sendTextMessage = (senderId, text) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: { text },
        }
    });
};

module.exports = (event) => {
    const commentId = event.value.comment_id;
    const senderId = event.value.sender_id;
    const postId = event.value.post_id;
    const userMessage = event.value.message;

    var genericMessage = "You commented on `" + userMessage + "` on our post `" + postId + "`";
    sendTextMessage(senderId,genericMessage);
};