const GETTY_IMAGES_API_KEY = '<place your GettyImages api token here>';

const request = require('request');

module.exports = (req, res) => {
    if (req.body.result.action === 'image') {
        const imageName = req.body.result.parameters['image_name'];
        const apiUrl = 'https://api.gettyimages.com/v3/search/images?fields=id,title,thumb,referral_destinations&sort_order=best&phrase=' + imageName;

        request({
            uri: apiUrl,
            methos: 'GET',
            headers: {'Api-Key': GETTY_IMAGES_API_KEY}
        }, (err, response, body) => {
            const imageUri = JSON.parse(body).images[0].display_sizes[0].uri;

            return res.json({
                speech: imageUri,
                displayText: imageUri,
                source: 'image_name'
            });
        })
    }
}
