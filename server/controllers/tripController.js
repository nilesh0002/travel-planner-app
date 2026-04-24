const tripService = require('../services/tripService');

// Create a new trip
async function createTrip(req, res) {
  try {
    const { title, start_date, end_date, user_id } = req.body;
    if (!title || !start_date || !end_date || !user_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const trip = await tripService.createTrip({ title, start_date, end_date, user_id });
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create trip' });
  }
}

// Get all trips for a user
async function getTripsByUser(req, res) {
  try {
    const { user_id } = req.params;
    const trips = await tripService.getTripsByUser(user_id);
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
}

// Get one trip by ID
async function getTripById(req, res) {
  try {
    const { id } = req.params;
    const trip = await tripService.getTripById(id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trip details' });
  }
}

// Update trip details
async function updateTrip(req, res) {
  try {
    const { id } = req.params;
    const updated = await tripService.updateTrip(id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update trip' });
  }
}

// Delete a trip
async function deleteTrip(req, res) {
  try {
    const { id } = req.params;
    await tripService.deleteTrip(id);
    res.status(200).json({ message: 'Trip deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete trip' });
  }
}

module.exports = {
  createTrip,
  getTripsByUser,
  getTripById,
  updateTrip,
  deleteTrip
};

