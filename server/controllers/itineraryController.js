const itineraryService = require('../services/itineraryService');

// Add a new item to the itinerary
async function addItem(req, res) {
  try {
    const { trip_id, day, type, title, location, time, description } = req.body;
    if (!trip_id || !day || !title) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const item = await itineraryService.addItem({ trip_id, day, type, title, location, time, description });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item' });
  }
}

// Get all items for a trip
async function getItemsByTrip(req, res) {
  try {
    const { trip_id } = req.params;
    const items = await itineraryService.getItemsByTrip(trip_id);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch itinerary' });
  }
}

// Update an itinerary item
async function updateItem(req, res) {
  try {
    const { id } = req.params;
    const updated = await itineraryService.updateItem(id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
}

// Delete an itinerary item
async function deleteItem(req, res) {
  try {
    const { id } = req.params;
    await itineraryService.deleteItem(id);
    res.status(200).json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
}

module.exports = {
  addItem,
  getItemsByTrip,
  updateItem,
  deleteItem
};

