const facebookAccessToken = {
    224239781409388 : 'EAABmovau6lkBAKGpc4uRCLBPlMLYLuGJZCJbUqPdDZAjSmSfgd35eASU4Blmyx9ehftKpC3XialyoGdtbHZBRHZAnuYpYqONGycgzUDbJs9AY1RRUT00KsBjnQXgBVWD6ZAgrkZBG0xRqzxiJRWBjMjZAFGEGLJlsAEmrebOFiVNVzvno3WBG7N8TBwt4CUU8ivJGWU93H0zAfe7Ym2Ip3B',
    1617002078374787 : 'EAABmovau6lkBAEN32nDgs8rK05FW51XJFPdlstD4nSZBGHRZAedJfXMaykAV3dccGZArYXUAd7ljXunIzHx9Y20KWtLZAksub6laL9JZBq3lBCcZAyEsIpw8WX4pWzoXrnwlWxbszch5l9vEGOQZCaAEyZCNtKkRXgc23TKMq1ZCEMAZDZD',
    486735555052779 : 'EAABmovau6lkBAN7EZCHAyZBhnZB0LS0pgiL55ZCDh9CPUWhDOVCDhsPMZBfauZCXEvhqtpp4lRYyPQoTysAqTznqZCuMcUKKTOB9tsl86eCpm7iybIPVuprg2MIJ6lmlB6ZBDjL5twPBvpUCN9Sm1T2J4d8TaP9kwUNEu43lZBw0LtQZDZD'
}

const facebookUserId = {
    852464038261499 : 1437288159680128,
    123939111678488 : 1540337582671286,
    1617002078374787: 1804321282941786
}

const request = require('request');

const senOptionQty = (sender,pageId) => {
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

    sendTemplateMessage(sender,pageId,messageData);
};

const createSalesOrder = (sender,) => {
    var request = require("request");

    var options = { method: 'POST',
    url: 'https://de732193.ngrok.io/Aurora/api/v1/38211/salesorder/SalesOrders',
    headers: 
        {   'cache-control': 'no-cache',
            authorization: 'Basic Q3VzdG9tZXJUcmFkZVByZW1pdW06T25saW5l',
            accept: 'application/json',
            'content-type': 'application/json' },
        body: '{\r\n\r\nDescription: \'Sales to FB Customer 1\',\r\nOrderDate: \'09/13/2017 00:00:00\',\r\nOrderedBy : \'8269B2F3-139B-4BA9-BA1A-C197AED7DA72\',\r\nWarehouseID : \'be56f57c-c97c-47ed-84ae-ebf01a758b5f\',\r\n\r\nSalesOrderLines:\r\n[\r\n\r\n{Description: \'FB Order item 1\', Item: \'0d16df33-db0a-46c2-a984-926d6ed57470\', UnitPrice: 61, Quantity: 2}\r\n\r\n]\r\n\r\n}' };

    request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
    });
};

const sendTemplateMessage = (senderId, pageId,text) => {
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

const sendTextMessage = (senderId, pageId, text) => {
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

const callPrivateReply = (messageData,comment_id) => {
  request({
    uri: 'https://graph.facebook.com/v2.9/'+comment_id+'/Comments',
    qs: { access_token: facebookAccessToken[pageid] },
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

const sendReceipt = (sender,pageId) => {
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
    
    sendTemplateMessage(sender,pageId,messageData);
}

module.exports = (event) => {
    const senderId = event.sender.id;//event.value.sender_id;
    const pageId = event.recipient.id;
    const payload = event.message.quick_reply.payload;
    var genericMessage = "";
    
    switch (payload) {
        case "YES_ORDER":
            senOptionQty(senderId,pageId);
            break;
        case "TWO_QTY":
            createSalesOrder();
            sendReceipt(senderId,pageId);
            break;
    }
};