const FACEBOOK_ACCESS_TOKEN = 'EAABmovau6lkBAEN32nDgs8rK05FW51XJFPdlstD4nSZBGHRZAedJfXMaykAV3dccGZArYXUAd7ljXunIzHx9Y20KWtLZAksub6laL9JZBq3lBCcZAyEsIpw8WX4pWzoXrnwlWxbszch5l9vEGOQZCaAEyZCNtKkRXgc23TKMq1ZCEMAZDZD';
//const FACEBOOK_ACCESS_TOKEN = 'EAABmovau6lkBAKGpc4uRCLBPlMLYLuGJZCJbUqPdDZAjSmSfgd35eASU4Blmyx9ehftKpC3XialyoGdtbHZBRHZAnuYpYqONGycgzUDbJs9AY1RRUT00KsBjnQXgBVWD6ZAgrkZBG0xRqzxiJRWBjMjZAFGEGLJlsAEmrebOFiVNVzvno3WBG7N8TBwt4CUU8ivJGWU93H0zAfe7Ym2Ip3B';

const request = require('request');

const senOptionQty = (sender) => {
    let messageData ={  "text": "Please specifiy the quantity you want to order",
                        "quick_replies":[
                                        {
                                            "content_type":"text",
                                            "title":"1",
                                            "payload":"ONE_QTY"
                                        },
                                        {
                                            "content_type":"text",
                                            "title":"2",
                                            "payload":"TWO_QTY"
                                        },
                                        {
                                            "content_type":"text",
                                            "title":"3",
                                            "payload":"THREE_QTY"
                                        },
                                        {
                                            "content_type":"text",
                                            "title":"Others",
                                            "payload":"OTHERS_QTY"
                                        }
                                    ]
                        }

    sendTemplateMessage(sender,messageData);
};

const sendTemplateMessage = (senderId, text) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: text,
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

const callPrivateReply = (messageData,comment_id) => {
  request({
    uri: 'https://graph.facebook.com/v2.9/'+comment_id+'/Comments',
    qs: { access_token: FACEBOOK_ACCESS_TOKEN },
    method: 'POST',
    json: messageData
}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
    } else {
      console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
    }
  });  
}

module.exports = (event) => {
    const senderId = 1437288159680128;//event.value.sender_id;
    const payload = event.message.quick_reply.payload;
    var genericMessage = "";
    
    switch (payload) {
        case "YES_ORDER":
            senOptionQty(senderId);
            break;
    }
};