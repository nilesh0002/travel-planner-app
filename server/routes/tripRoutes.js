const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');

// Define routes for trips
router.get('/id/:id', tripController.getTripById);
router.get('/:user_id', tripController.getTripsByUser);
router.post('/', tripController.createTrip);
router.put('/:id', tripController.updateTrip);
router.delete('/:id', tripController.deleteTrip);

module.exports = router;

