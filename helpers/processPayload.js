const facebookAccessToken = {
    224239781409388 : 'EAABmovau6lkBAKGpc4uRCLBPlMLYLuGJZCJbUqPdDZAjSmSfgd35eASU4Blmyx9ehftKpC3XialyoGdtbHZBRHZAnuYpYqONGycgzUDbJs9AY1RRUT00KsBjnQXgBVWD6ZAgrkZBG0xRqzxiJRWBjMjZAFGEGLJlsAEmrebOFiVNVzvno3WBG7N8TBwt4CUU8ivJGWU93H0zAfe7Ym2Ip3B',
    1617002078374787 : 'EAABmovau6lkBAEN32nDgs8rK05FW51XJFPdlstD4nSZBGHRZAedJfXMaykAV3dccGZArYXUAd7ljXunIzHx9Y20KWtLZAksub6laL9JZBq3lBCcZAyEsIpw8WX4pWzoXrnwlWxbszch5l9vEGOQZCaAEyZCNtKkRXgc23TKMq1ZCEMAZDZD',
    486735555052779 : 'EAABmovau6lkBAN7EZCHAyZBhnZB0LS0pgiL55ZCDh9CPUWhDOVCDhsPMZBfauZCXEvhqtpp4lRYyPQoTysAqTznqZCuMcUKKTOB9tsl86eCpm7iybIPVuprg2MIJ6lmlB6ZBDjL5twPBvpUCN9Sm1T2J4d8TaP9kwUNEu43lZBw0LtQZDZD'
};

const request = require('request');

const senOptionQty = (sender,pageId,itemcode,itemprice, senderName) => {
    let messageData =   {  "text": "Please specifiy the quantity you want to order",
                        "quick_replies":[
                                        {
                                            "content_type":"text",
                                            "title":"1",
                                            "payload":"1_QTY_" + itemcode + "_" + itemprice + "_" + senderName
                                        },
                                        {
                                            "content_type":"text",
                                            "title":"2",
                                            "payload":"2_QTY_" + itemcode + "_" + itemprice + "_" + senderName
                                        },
                                        {
                                            "content_type":"text",
                                            "title":"3",
                                            "payload":"3_QTY_" + itemcode + "_" + itemprice + "_" + senderName
                                        },
                                        {
                                            "content_type":"text",
                                            "title":"Others",
                                            "payload":"0_QTY_" + itemcode + "_" + itemprice + "_" + senderName
                                        }
                                    ]
                        }

    sendTemplateMessage(sender,pageId,messageData);
};

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

const checkAccount = (userId,pageId, accntName, qty,itemcode,itemprice) => {
    var acctCode = zeroPad(userId,18);
    var options = { method: 'GET',
    url: 'https://7729ce14.ngrok.io/Aurora/api/v1/38211/crm/Accounts',
    qs: { '$select': 'ID', '$filter': "Code eq \'" + acctCode + "\'" },
    headers: 
    {   'cache-control': 'no-cache',
        authorization: 'Basic Q3VzdG9tZXJUcmFkZVByZW1pdW06T25saW5l',
        accept: 'application/json',
        'content-type': 'application/json' }};
    request(options, function (error, response, body) {
    if (error) throw new Error(error);
        var jsonBody = JSON.parse(body);
        if (jsonBody.d.results && jsonBody.d.results.length > 0) {
            getItemForOrder(userId,pageId,jsonBody.d.results[0].ID,accntName,qty,itemcode,itemprice);
        } else {
            createAccount(userId,pageId, accntName, qty,itemcode,itemprice);
        }
    });
}

const createAccount = (userId,pageId, accntName, qty,itemcode,itemprice) => {
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
        getItemForOrder(userId,pageId,body.d.ID,accntName,qty,itemcode,itemprice);
    });
};

const getItemForOrder = (userId,pageId,customerId,customerName,qty,itemcode,itemprice) => {
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
            createSalesOrder(userId,pageId,customerId,customerName,qty,item.Item,item.ItemDescription,item.Warehouse,itemprice);
        }
    });
}

const createSalesOrder = (userId,pageId,customerId,customerName,qty,itemid,itemdesc,warehouse,itemprice) => {
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
                            UnitPrice: parseFloat(itemprice), Quantity: parseInt(qty)
                        }
                    ]}
        };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);        
        sendReceipt(userId,pageId,customerName,itemdesc,itemprice,qty);
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

function toTimestamp(strDate){
   var datum = Date.parse(strDate);
   return datum/1000;
}

const sendReceipt = (sender,pageId,customerName,itemdesc,itemprice,qty) => {
    let messageData = {
                    "attachment":{
                    "type":"template",
                    "payload":{
                        "template_type":"receipt",
                        "recipient_name":customerName,
                        "order_number":"12345678902",
                        "currency":"GBP",
                        "payment_method":"Visa 2345",        
                        "order_url":"http://petersapparel.parseapp.com/order?order_id=123456",
                        "timestamp": toTimestamp(new Date()),         
                        "address":{
                        "street_1":"Sample Address",
                        "street_2":"",
                        "city":"Menlo Park",
                        "postal_code":"94025",
                        "state":"CA",
                        "country":"US"
                        },
                        "summary":{
                        "subtotal":parseFloat(itemprice) * parseInt(qty),
                        "shipping_cost":0.00,
                        "total_tax":0.00,
                        "total_cost":parseFloat(itemprice) * parseInt(qty)
                        },
                        "elements":[
                        {
                            "title":itemdesc,
                            "subtitle":itemdesc,
                            "quantity":parseInt(qty),
                            "price":parseFloat(itemprice),
                            "currency":"GBP",
                            "image_url":"https://eol-aurora.herokuapp.com/sample-image.jpg"
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
    switch (secItem[1]) {
        case "ORDER":
            if (secItem[0] == 'YES') {
                senOptionQty(senderId,pageId,secItem[2],secItem[3],secItem[4]);
            }
            break;
        case "QTY":
            const senderName = secItem[4];
            checkAccount(senderId,pageId,senderName,secItem[0],secItem[2],secItem[3]);
            break;
    }
};