const FACEBOOK_ACCESS_TOKEN = 'EAABmovau6lkBAJ8bTwPlremnr33yfjnNZCY9Dm3Fntcy2ZAZBwFFwqWUfJmRas76CEBx3yyD2UufTgcDvCw8hxjr3vJ4NMskI9d5nzwneOwvbSZAelO2NZCKWI2WfJSOKSZArRL636tPXbj9NqzbGz1I4GanqPD6IyoVp3EhU7eAZDZD';
//const FACEBOOK_ACCESS_TOKEN = 'EAABmovau6lkBAKGpc4uRCLBPlMLYLuGJZCJbUqPdDZAjSmSfgd35eASU4Blmyx9ehftKpC3XialyoGdtbHZBRHZAnuYpYqONGycgzUDbJs9AY1RRUT00KsBjnQXgBVWD6ZAgrkZBG0xRqzxiJRWBjMjZAFGEGLJlsAEmrebOFiVNVzvno3WBG7N8TBwt4CUU8ivJGWU93H0zAfe7Ym2Ip3B';

const request = require('request');

const sendQuickreply = (sender,message) => {
    let messageData ={  "text": message,
                        "quick_replies":[
                                        {
                                            "content_type":"text",
                                            "title":"Yes",
                                            "payload":"Yes",
                                            "image_url":"https://eol-aurora.herokuapp.com/icons/aurora-like.png"
                                        },
                                        {
                                            "content_type":"text",
                                            "title":"No",
                                            "payload":"No",
                                            "image_url":"https://eol-aurora.herokuapp.com/icons/aurora-unlike.png"
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

module.exports = (event,type) => {
    const commentId = event.value.comment_id;
    const senderId = 1437288159680128;//event.value.sender_id;
    const postId = event.value.post_id;
    const userMessage = event.value.message;
    var genericMessage = "";
    if (type == 0) {
         genericMessage = "You commented `" + userMessage + "` on our post would you like to order this item now?";
    } else {
        genericMessage = "You seems to like our post would you like to order this item now?";
    }
    
    var messageData = {
                message: genericMessage
              };

    //sendTextMessage(senderId,genericMessage);
    //callPrivateReply(messageData, commentId);
    sendQuickreply(senderId,genericMessage);
};