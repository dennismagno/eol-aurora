const API_AI_TOKEN = '6e744e50095d4f40ab694d057837b985';
const FACEBOOK_ACCESS_TOKEN = 'EAABmovau6lkBAE04GzhgftRk1kA4FZAeggl1ZCZCso6csHZBmKVrlHpxPWNkyGdw41NssErIDYgZCPk1XPBIZCUiPWoJLsxhYulmLqJ8AYm7lZCtRBVIwhfWOMp1YeX8XLgy8dvXEV0CqGiLNA0BH6aqXeZCZAVCTZBn3AlOEigjRbogKNukWWd8Wh';

const request = require('request');

const apiAiClient = require('apiai')(API_AI_TOKEN);

const sendImage = (senderId, imageUri) => {
    return request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: {
                attachment: {
                    type: 'image',
                    payload: { url: imageUri }
                }
            }
        }
    });
};

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
    const senderId = event.sender.id;
    const message = event.message.text;

    const apiaiSession = apiAiClient.textRequest(message, {sessionId: 'EOL Aurora'});

    apiaiSession.on('response', (response) => {
        const result = response.result.fulfillment.speech;

        if (response.result.metadata.intentName === 'images.search') {
            sendImage(senderId, result);
        } else {
            sendTextMessage(senderId, result);
        }
    });

    apiaiSession.on('error', error => console.log(error));
    apiaiSession.end();
};
