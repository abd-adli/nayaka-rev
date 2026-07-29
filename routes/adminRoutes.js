const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

// Apply auth middleware to all admin routes
router.use(isAuthenticated, isAdmin);

router.get('/dashboard', adminController.getDashboard);

// Destinations
router.get('/destinations', adminController.getDestinations);
router.post('/destinations', adminController.postDestination);
router.post('/destinations/:id/delete', adminController.postDeleteDestination);

// Trips
router.get('/trips', adminController.getTrips);
router.post('/trips', adminController.postTrip);
router.post('/trips/:id/delete', adminController.postDeleteTrip);

// Bookings
router.get('/bookings', adminController.getBookings);
router.post('/bookings/:id/status', adminController.postUpdateBookingStatus);

module.exports = router;
