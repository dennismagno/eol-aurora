const facebookAccessToken = {
    224239781409388 : 'EAABmovau6lkBAKGpc4uRCLBPlMLYLuGJZCJbUqPdDZAjSmSfgd35eASU4Blmyx9ehftKpC3XialyoGdtbHZBRHZAnuYpYqONGycgzUDbJs9AY1RRUT00KsBjnQXgBVWD6ZAgrkZBG0xRqzxiJRWBjMjZAFGEGLJlsAEmrebOFiVNVzvno3WBG7N8TBwt4CUU8ivJGWU93H0zAfe7Ym2Ip3B',
    1617002078374787 : 'EAABmovau6lkBAEN32nDgs8rK05FW51XJFPdlstD4nSZBGHRZAedJfXMaykAV3dccGZArYXUAd7ljXunIzHx9Y20KWtLZAksub6laL9JZBq3lBCcZAyEsIpw8WX4pWzoXrnwlWxbszch5l9vEGOQZCaAEyZCNtKkRXgc23TKMq1ZCEMAZDZD',
    486735555052779 : 'EAABmovau6lkBAN7EZCHAyZBhnZB0LS0pgiL55ZCDh9CPUWhDOVCDhsPMZBfauZCXEvhqtpp4lRYyPQoTysAqTznqZCuMcUKKTOB9tsl86eCpm7iybIPVuprg2MIJ6lmlB6ZBDjL5twPBvpUCN9Sm1T2J4d8TaP9kwUNEu43lZBw0LtQZDZD'
};

const request = require('request');

const senOptionQty = (sender,pageId,itemcode,senderName) => {
    let messageData =   {  "text": "Please specifiy the quantity you want to order",
                        "quick_replies":[
                                        {
                                            "content_type":"text",
                                            "title":"1",
                                            "payload":"1_QTY_" + itemcode + "_" + senderName
                                        },
                                        {
                                            "content_type":"text",
                                            "title":"2",
                                            "payload":"2_QTY_" + itemcode + "_" + senderName
                                        },
                                        {
                                            "content_type":"text",
                                            "title":"3",
                                            "payload":"3_QTY_" + itemcode + "_" + senderName
                                        },
                                        {
                                            "content_type":"text",
                                            "title":"Others",
                                            "payload":"0_QTY_" + itemcode + "_" + senderName
                                        }
                                    ]
                        }

    sendTemplateMessage(sender,pageId,messageData);
};

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

const createAccount = (userId, accntName, qty,itemcode) => {
    var acctCode = zeroPad(userId,18);
    var options = { method: 'POST',
    url: 'https://7729ce14.ngrok.io/Aurora/api/v1/38211/crm/Accounts',
        headers: {  'cache-control': 'no-cache',
                    authorization: 'Basic Q3VzdG9tZXJUcmFkZVByZW1pdW06T25saW5l',
                    accept: 'application/json','content-type': 'application/json' 
                },
        json : { Code : acctCode, Name  : accntName, Type : 'A', Status : 'C'}
    };    

    request(options, function (error, response, body) {
    if (error) throw new Error(error);
        console.log(body);
        getItemForOrder(body.d.ID,accntName,qty,itemcode);
    });
};

const getItemForOrder = (customerId,customerName,qty,itemcode) => {
    var options = { method: 'GET',
    url: 'https://7729ce14.ngrok.io/Aurora/api/v1/38211/inventory/ItemWarehouses',
    qs: { '$select': 'Item,ItemDescription,Warehouse',
          '$top': '1',
          '$filter': "ItemCode eq \'" + itemcode + "\'" },
    headers: 
    {  'cache-control': 'no-cache',
        authorization: 'Basic Q3VzdG9tZXJUcmFkZVByZW1pdW06T25saW5l',
        accept: 'application/json',
        'content-type': 'application/json' } };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        var bodyParse = JSON.parse(body);
        if (bodyParse.d && bodyParse.d.length > 0) {
            var item = bodyParse.d[0];
            createSalesOrder(customerId,customerName,qty,item.Item,item.ItemDescription,item.Warehouse);
        }
    });
}

const createSalesOrder = (customerId,customerName,qty,itemid,itemdesc,warehouse) => {
    var options = { method: 'POST',
    url: 'https://7729ce14.ngrok.io/Aurora/api/v1/38211/salesorder/SalesOrders',
    headers: 
        {   'cache-control': 'no-cache',
            authorization: 'Basic Q3VzdG9tZXJUcmFkZVByZW1pdW06T25saW5l',
            accept: 'application/json',
            'content-type': 'application/json' },
        json : { 
                    Description : 'Sales to ' + customerName, 
                    OrderedBy : customerId, 
                    WarehouseID : warehouse,
                    SalesOrderLines : [
                        {
                            Description: itemdesc,
                            Item: itemid,
                            UnitPrice: 61, Quantity: parseInt(qty)
                        }
                    ]}
        };

    request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
    });
};

const sendTemplateMessage = (senderId, pageId,text) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: facebookAccessToken[pageId] },
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
        qs: { access_token: facebookAccessToken[pageId] },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: { text },
        }
    });
};

const callPrivateReply = (messageData,pageId,comment_id) => {
  request({
    uri: 'https://graph.facebook.com/v2.9/'+comment_id+'/Comments',
    qs: { access_token: facebookAccessToken[pageId] },
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
    
    var secItem = payload.split('_');
    const senderName = secItem[3];
    switch (secItem[1]) {
        case "ORDER":
            if (secItem[0] == 'YES') {
                senOptionQty(senderId,pageId,secItem[2],secItem[3]);
            }
            break;
        case "QTY":
            createAccount(senderId,senderName,secItem[0],secItem[2]);
            sendReceipt(senderId,pageId);
            break;
    }
};