const express = require('express');
const router = express.Router();
const {
  createShortUrl,
  getAllUrls,
  deleteUrl,
  redirectToOriginalUrl
} = require('../controllers/urlController');

// API routes
router.post('/shorten', createShortUrl);
router.get('/', getAllUrls);
router.delete('/:id', deleteUrl);

// Redirect route — must be last so it doesn't override API paths
router.get('/:shortId', redirectToOriginalUrl);

module.exports = router;
