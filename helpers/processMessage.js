const API_AI_TOKEN = '6e744e50095d4f40ab694d057837b985';
const FACEBOOK_ACCESS_TOKEN = 'EAABmovau6lkBAFZAGzhMHcPhd7p05ka28AnKKEgZB10j07ovePrsAZCdS8vphMYGgPVKWmxcVifOZBIsgbDAcRuekQyurRvCbqdC1O8vtospfLTDWJKuTlXbSfppCR79CJZAKKyLR9fwQTCZAD0YGLk2ZB9z7wXRueSxtAWIHEJEZAAw7mbs4mgm';

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

    const apiaiSession = apiAiClient.textRequest(message, {sessionId: 'botcube_co'});

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
