const API_AI_TOKEN = '6e744e50095d4f40ab694d057837b985';

const facebookAccessToken = {
    224239781409388 : 'EAABmovau6lkBAKGpc4uRCLBPlMLYLuGJZCJbUqPdDZAjSmSfgd35eASU4Blmyx9ehftKpC3XialyoGdtbHZBRHZAnuYpYqONGycgzUDbJs9AY1RRUT00KsBjnQXgBVWD6ZAgrkZBG0xRqzxiJRWBjMjZAFGEGLJlsAEmrebOFiVNVzvno3WBG7N8TBwt4CUU8ivJGWU93H0zAfe7Ym2Ip3B',
    1617002078374787 : 'EAABmovau6lkBAEN32nDgs8rK05FW51XJFPdlstD4nSZBGHRZAedJfXMaykAV3dccGZArYXUAd7ljXunIzHx9Y20KWtLZAksub6laL9JZBq3lBCcZAyEsIpw8WX4pWzoXrnwlWxbszch5l9vEGOQZCaAEyZCNtKkRXgc23TKMq1ZCEMAZDZD',
    486735555052779 : 'EAABmovau6lkBAN7EZCHAyZBhnZB0LS0pgiL55ZCDh9CPUWhDOVCDhsPMZBfauZCXEvhqtpp4lRYyPQoTysAqTznqZCuMcUKKTOB9tsl86eCpm7iybIPVuprg2MIJ6lmlB6ZBDjL5twPBvpUCN9Sm1T2J4d8TaP9kwUNEu43lZBw0LtQZDZD'
};
//const FACEBOOK_ACCESS_TOKEN = 'EAABmovau6lkBAEN32nDgs8rK05FW51XJFPdlstD4nSZBGHRZAedJfXMaykAV3dccGZArYXUAd7ljXunIzHx9Y20KWtLZAksub6laL9JZBq3lBCcZAyEsIpw8WX4pWzoXrnwlWxbszch5l9vEGOQZCaAEyZCNtKkRXgc23TKMq1ZCEMAZDZD';
//const FACEBOOK_ACCESS_TOKEN = 'EAABmovau6lkBAKGpc4uRCLBPlMLYLuGJZCJbUqPdDZAjSmSfgd35eASU4Blmyx9ehftKpC3XialyoGdtbHZBRHZAnuYpYqONGycgzUDbJs9AY1RRUT00KsBjnQXgBVWD6ZAgrkZBG0xRqzxiJRWBjMjZAFGEGLJlsAEmrebOFiVNVzvno3WBG7N8TBwt4CUU8ivJGWU93H0zAfe7Ym2Ip3B';

const request = require('request');

const apiAiClient = require('apiai')(API_AI_TOKEN);

const sendImage = (senderId, pageid, imageUri) => {
    return request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: facebookAccessToken[pageid] },
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

const sendTemplateMessage = (senderId, pageid, text) => {
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

const sendTextMessage = (senderId, pageid, text) => {
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

const sendQuickreply = (sender, pageid) => {
    let messageData ={  "text": "Here's a quick reply!",
                        "quick_replies":[
                                        {
                                            "content_type":"text",
                                            "title":"Search",
                                            "payload":"<POSTBACK_PAYLOAD>",
                                            "image_url":"https://eol-aurora.herokuapp.com/icons/aurora-like.png"
                                        },
                                        {
                                            "content_type":"location"
                                        },
                                        {
                                            "content_type":"text",
                                            "title":"Something Else",
                                            "payload":"<POSTBACK_PAYLOAD>"
                                        }
                                    ]
                        }

    sendTemplateMessage(sender,pageid,messageData);
};

const sendReceipt = (sender,pageid) => {
    let messageData = {
                    "attachment":{
                    "type":"template",
                    "payload":{
                        "template_type":"receipt",
                        "recipient_name":"Stephane Crozatier",
                        "order_number":"12345678902",
                        "currency":"USD",
                        "payment_method":"Visa 2345",        
                        "order_url":"http://petersapparel.parseapp.com/order?order_id=123456",
                        "timestamp":"1428444852",         
                        "address":{
                        "street_1":"1 Hacker Way",
                        "street_2":"",
                        "city":"Menlo Park",
                        "postal_code":"94025",
                        "state":"CA",
                        "country":"US"
                        },
                        "summary":{
                        "subtotal":75.00,
                        "shipping_cost":4.95,
                        "total_tax":6.19,
                        "total_cost":56.14
                        },
                        "adjustments":[
                        {
                            "name":"New Customer Discount",
                            "amount":20
                        },
                        {
                            "name":"$10 Off Coupon",
                            "amount":10
                        }
                        ],
                        "elements":[
                        {
                            "title":"Classic White T-Shirt",
                            "subtitle":"100% Soft and Luxurious Cotton",
                            "quantity":2,
                            "price":50,
                            "currency":"USD",
                            "image_url":"http://petersapparel.parseapp.com/img/whiteshirt.png"
                        },
                        {
                            "title":"Classic Gray T-Shirt",
                            "subtitle":"100% Soft and Luxurious Cotton",
                            "quantity":1,
                            "price":25,
                            "currency":"USD",
                            "image_url":"http://petersapparel.parseapp.com/img/grayshirt.png"
                        }
                        ]
                    }
                    }
                }
    
    sendTemplateMessage(sender,pageid,messageData);
}

const sendGenericMessage = (sender,pageid) => {
    let messageData = {
	    "attachment": {
		    "type": "template",
		    "payload": {
				"template_type": "generic",
			    "elements": [{
					"title": "First card",
				    "subtitle": "Gundam News, Gunpla Latest Release Model Kits",
				    "image_url": "http://www.gundamtoyshop.com/uploads/1/4/1/7/14174478/4598971_orig.jpg",
				    "buttons": [{
					    "type": "web_url",
					    "url": "https://www.messenger.com",
					    "title": "web url"
				    }, {
					    "type": "postback",
					    "title": "Postback",
					    "payload": "Payload for first element in a generic bubble",
				    }],
			    }, {
				    "title": "Second card",
				    "subtitle": "Perfect Grade Strike Gundam",
				    "image_url": "https://vignette2.wikia.nocookie.net/gundam/images/6/6a/Pg-strike-gundam-box.jpg",
				    "buttons": [{
					    "type": "postback",
					    "title": "Postback",
					    "payload": "Payload for second element in a generic bubble",
				    }],
			    }]
		    }
	    }
    }

    sendTemplateMessage(sender,pageid,messageData);
};

const postOnFB = (pageid) => {
    request({
        url: 'https://graph.facebook.com/v2.10/1617002078374787/photos',
        qs: { access_token: facebookAccessToken[pageid] },
        method: 'POST',
        json: {
            message: "This is test post from code",
            url: "https://d2ev13g7cze5ka.cloudfront.net/ban/bann15630_0_1490085596.jpg",
        }
    });
};

const getEOLJournal = () => {
    var options = { method: 'GET',
    url: 'https://5a109f3c.ngrok.io/WI775382/api/v1/50580/financial/Journals',
    headers:  { 'cache-control': 'no-cache',
                accept: 'application/json',
                'content-type': 'application/json;charset=utf-8',
                authorization: 'Basic Q3VzdG9tZXJBZHZhbmNlZFVLOk9ubGluZQ==' 
                } 
            };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
    });
};

const insertAccount = () => {
    var request = require("request");

    var options = { method: 'POST',
    url: 'https://7729ce14.ngrok.io/Aurora/api/v1/38211/crm/Accounts',
        headers: {  'cache-control': 'no-cache',
                    authorization: 'Basic Q3VzdG9tZXJUcmFkZVByZW1pdW06T25saW5l',
                    accept: 'application/json','content-type': 'application/json' 
                },
        json : { Code : '               333', Name  : 'Test account 3', Type : 'A', Status : 'C'}
    };    

    request(options, function (error, response, body) {
    if (error) throw new Error(error);
        console.log(body.d.ID);
    });
};

const getItemForOrder = () => {
    var options = { method: 'GET',
    url: 'http://lt-14-522/Aurora/api/v1/38211/inventory/ItemWarehouses',
    qs: { '$select': 'Item,ItemDescription,Warehouse',
          '$top': '1',
          '$filter': 'ItemCode eq \'IND300654\'' },
    headers: 
    {  'cache-control': 'no-cache',
        authorization: 'Basic Q3VzdG9tZXJUcmFkZVByZW1pdW06T25saW5l',
        accept: 'application/json',
        'content-type': 'application/json' } };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        var bodyParse = JSON.parse(body);
        if (bodyParse.d && bodyParse.d.length > 0) {
            console.log(bodyParse.d[0].Item);
        }
    });
}

const checkAccount = () => {
    var request = require("request");

    var options = { method: 'GET',
    url: 'https://7729ce14.ngrok.io/Aurora/api/v1/38211/crm/Accounts',
    qs: { '$select': 'ID', '$filter': 'Code eq \'001437288159680128\'' },
    headers: 
    { 'postman-token': '28cff6d5-f55c-37c1-735b-4a0368e124c6',
        'cache-control': 'no-cache',
        authorization: 'Basic Q3VzdG9tZXJUcmFkZVByZW1pdW06T25saW5l',
        accept: 'application/json',
        'content-type': 'application/json' }};
    request(options, function (error, response, body) {
    if (error) throw new Error(error);
        var jsonBody = JSON.parse(body);
        if (jsonBody.d.results && jsonBody.d.results.length > 0) {
            console.log(jsonBody.d.results[0].ID);
        }
    });
}

module.exports = (event) => {
    const senderId = event.sender.id;
    const message = event.message.text;
    const pageId = event.recipient.id;

    const apiaiSession = apiAiClient.textRequest(message, {sessionId: 'EOL Aurora'});
    apiaiSession.on('response', (response) => {
        const result = response.result.fulfillment.speech;

        if (response.result.metadata.intentName === 'images.search') {
            sendImage(senderId, result);
        } else {
            console.log(event.sender);
            if (event.message && event.message.text) {
                let text = event.message.text
                switch (text) {
                    case "Generic":
                        sendGenericMessage(senderId,pageId);
                        break;
                    case "Quick":
                        sendQuickreply(senderId,pageId);
                        break;
                    case "Receipt":
                        sendReceipt(senderId,pageId);
                        break;
                    case "PostToFB":
                        postOnFB(pageId);
                        break;
                    case "GetEOL":
                        getEOLJournal();
                        break;
                    case "Account":
                        insertAccount();
                        break;
                    case "ItemOrder":
                        getItemForOrder();
                        break;
                    case "CheckAccount":
                        checkAccount();
                        break;
                    default:
                        sendTextMessage(senderId, pageId,result);
                        break;
                }
            } else {
                sendTextMessage(senderId, pageId,result);
            }
        }
    });

    apiaiSession.on('error', error => console.log(error));
    apiaiSession.end();
};
