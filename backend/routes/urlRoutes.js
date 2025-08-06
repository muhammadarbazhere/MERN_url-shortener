const express = require('express');
const router = express.Router();
const { createShortUrl,
    deleteUrl,
    getAllUrls
 } = require('../controllers/urlController');

// short url 
router.post('/shorten', createShortUrl);
// show all url
router.get('/', getAllUrls);
// delete the url
router.delete('/:id', deleteUrl);

module.exports = router;
