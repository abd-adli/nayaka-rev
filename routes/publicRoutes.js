const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const destinationController = require('../controllers/destinationController');
const bookingController = require('../controllers/bookingController');

router.get('/', homeController.getHome);
router.get('/destinations/:slug', destinationController.getDestinationBySlug);
router.post('/bookings', bookingController.postBooking);

module.exports = router;
