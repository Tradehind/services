const express = require('express');
const router = express.Router();
const sellerPortalController = require('../controllers/sellerPortal/sellerPortalController');


router.get('/profile-by-id', sellerPortalController.getSellerById);

module.exports = router;