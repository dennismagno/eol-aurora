const facebookAccessToken = {
    224239781409388 : 'EAABmovau6lkBAKGpc4uRCLBPlMLYLuGJZCJbUqPdDZAjSmSfgd35eASU4Blmyx9ehftKpC3XialyoGdtbHZBRHZAnuYpYqONGycgzUDbJs9AY1RRUT00KsBjnQXgBVWD6ZAgrkZBG0xRqzxiJRWBjMjZAFGEGLJlsAEmrebOFiVNVzvno3WBG7N8TBwt4CUU8ivJGWU93H0zAfe7Ym2Ip3B',
    1617002078374787 : 'EAABmovau6lkBAEN32nDgs8rK05FW51XJFPdlstD4nSZBGHRZAedJfXMaykAV3dccGZArYXUAd7ljXunIzHx9Y20KWtLZAksub6laL9JZBq3lBCcZAyEsIpw8WX4pWzoXrnwlWxbszch5l9vEGOQZCaAEyZCNtKkRXgc23TKMq1ZCEMAZDZD',
    486735555052779 : 'EAABmovau6lkBAN7EZCHAyZBhnZB0LS0pgiL55ZCDh9CPUWhDOVCDhsPMZBfauZCXEvhqtpp4lRYyPQoTysAqTznqZCuMcUKKTOB9tsl86eCpm7iybIPVuprg2MIJ6lmlB6ZBDjL5twPBvpUCN9Sm1T2J4d8TaP9kwUNEu43lZBw0LtQZDZD',
    1120366894763266 : 'EAABmovau6lkBACMOLZAkH81dZCcFsXLZBNylV2j9Hn2XusrZCiPNF6DBc323Pxc5qHdnPZCp8XzN1EpSiUe90ZAZABCb7ZA2cKLZBC1ME7HcHVDc8eOiFvrx9ZA29UQPNp9dZBZCvYSiii5iBV6MdNmdFqwqlgDFZCiNMaLRyw7iYoX0wxAZDZD'
};

const facebookUserId = {
    852464038261499 : 1437288159680128,
    123939111678488 : 1540337582671286,
    1617002078374787: 1804321282941786,
    10208565737134730 : 1375537922563007
};

const request = require('request');

const sendQuickreply = (sender,pageid,message,itemcode,itemprice,senderName,itemDivision) => {
    let messageData ={  "text": message,
                        "quick_replies":[
                                        {
                                            "content_type":"text",
                                            "title":"Yes",
                                            "payload":"YES_ORDER_" + itemcode + "_" + itemprice + "_" + senderName + "_" + itemDivision,
                                            "image_url":"https://eol-aurora.herokuapp.com/icons/aurora-like.png"
                                        },
                                        {
                                            "content_type":"text",
                                            "title":"No",
                                            "payload":"NO_ORDER_" + itemcode + "_" + itemprice + "_" + senderName + "_" + itemDivision,
                                            "image_url":"https://eol-aurora.herokuapp.com/icons/aurora-unlike.png"
                                        }
                                    ]
                        }

    sendTemplateMessage(sender,pageid,messageData);
};

const sendTemplateMessage = (senderId,pageid, text) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: facebookAccessToken[pageid] },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: text,
        }
    });
};

const sendTextMessage = (senderId,pageid, text) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: facebookAccessToken[pageid] },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: { text },
        }
    });
};

const callPrivateReply = (messageData,pageid,comment_id) => {
  request({
    uri: 'https://graph.facebook.com/v2.9/'+comment_id+'/Comments',
    qs: { access_token: facebookAccessToken[pageid]  },
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

function getPostDetails(postId,pageId,callback) {
    var options = { method: 'GET',
    url: 'https://graph.facebook.com/v2.6/' + postId,
    qs: { access_token: facebookAccessToken[pageId] },
    headers: { 'cache-control': 'no-cache' } };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        callback(response.body);
    });
}

module.exports = (event,type) => {
    const commentId = event.value.post_id;
    const postId = event.value.post_id;
    const pageId = postId.split("_")[0];
    const senderId = facebookUserId[event.value.sender_id];
    const senderName = event.value.sender_name;
    var postMessage = '';

    getPostDetails(postId,pageId, function(post) {
        var jsonPost = JSON.parse(post);
        console.log(jsonPost.message);
        postMessage = jsonPost.message;
        var codeLine = '';
        var itemCode = '';
        var itemPrice = '';
        var itemDivision = '';
        if (postMessage.toLocaleLowerCase().indexOf('item for sale') >= 0) {
            var msgLine = postMessage.split('\n');
            if (msgLine.length < 3) return;
            //item code
            codeLine = msgLine[1];
            var codeParse = codeLine.split(":");
            var fbitemParse = codeParse[1].split("-");
            itemCode = fbitemParse[0];
            itemCode = itemCode.replace(" ","");
            itemDivision = fbitemParse[1];
            itemDivision = itemDivision.replace(" ","");
            console.log(fbitemParse);

            //item price
            var priceLine = msgLine[2];
            var priceParse = priceLine.split(":");
            itemPrice = priceParse[1];
            itemPrice = itemPrice.replace(" ","");
        }


        var genericMessage = "";
        if (type == 0) {
            genericMessage = "You commented on our post about item " + codeLine + " would you like to order this item now?";
        } else {
            genericMessage = "You seems to like our post about item " + codeLine + " would you like to order this item now?";
        }
        
        var messageData = {
                    message: genericMessage
                };

        sendQuickreply(senderId,pageId,genericMessage,itemCode,itemPrice,senderName,itemDivision);
    });
};