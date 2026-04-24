const prisma = require('../config/db');

/**
 * Service to handle Itinerary-related database operations using Prisma
 */
const itineraryService = {
  /**
   * Add a new item to the itinerary
   */
  async addItem(itemData) {
    try {
      return await prisma.itineraryItem.create({
        data: {
          trip_id: itemData.trip_id,
          day: parseInt(itemData.day),
          type: itemData.type,
          title: itemData.title,
          location: itemData.location,
          time: itemData.time,
          description: itemData.description
        }
      });
    } catch (error) {
      console.error('Prisma Error adding item:', error);
      throw error;
    }
  },

  /**
   * Fetch all itinerary items for a specific trip
   */
  async getItemsByTrip(tripId) {
    try {
      return await prisma.itineraryItem.findMany({
        where: { trip_id: tripId },
        orderBy: [
          { day: 'asc' },
          { time: 'asc' }
        ]
      });
    } catch (error) {
      console.error('Prisma Error fetching items:', error);
      throw error;
    }
  },

  /**
   * Update an existing itinerary item
   */
  async updateItem(itemId, itemData) {
    try {
      return await prisma.itineraryItem.update({
        where: { id: itemId },
        data: {
          ...itemData,
          day: itemData.day ? parseInt(itemData.day) : undefined
        }
      });
    } catch (error) {
      console.error('Prisma Error updating item:', error);
      throw error;
    }
  },

  /**
   * Delete an itinerary item
   */
  async deleteItem(itemId) {
    try {
      await prisma.itineraryItem.delete({
        where: { id: itemId }
      });
      return { message: 'Item deleted successfully' };
    } catch (error) {
      console.error('Prisma Error deleting item:', error);
      throw error;
    }
  }
};

module.exports = itineraryService;

