const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itineraryController');

// Define routes for itinerary items
router.post('/', itineraryController.addItem);
router.get('/:trip_id', itineraryController.getItemsByTrip);
router.put('/:id', itineraryController.updateItem);
router.delete('/:id', itineraryController.deleteItem);

module.exports = router;
