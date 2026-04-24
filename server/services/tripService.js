const prisma = require('../config/db');

/**
 * Service to handle Trip-related database operations using Prisma
 */
const tripService = {
  /**
   * Create a new trip in the database
   */
  async createTrip(tripData) {
    try {
      return await prisma.trip.create({
        data: {
          user_id: tripData.user_id,
          title: tripData.title,
          start_date: new Date(tripData.start_date),
          end_date: new Date(tripData.end_date)
        }
      });
    } catch (error) {
      console.error('Prisma Error creating trip:', error);
      throw error;
    }
  },

  /**
   * Fetch all trips for a specific user ID
   */
  async getTripsByUser(userId) {
    try {
      return await prisma.trip.findMany({
        where: { user_id: userId },
        orderBy: { start_date: 'asc' },
        include: { items: true }
      });
    } catch (error) {
      console.error('Prisma Error fetching trips:', error);
      throw error;
    }
  },

  /**
   * Fetch a single trip by ID
   */
  async getTripById(tripId) {
    try {
      return await prisma.trip.findUnique({
        where: { id: tripId },
        include: { items: true }
      });
    } catch (error) {
      console.error('Prisma Error fetching trip by ID:', error);
      throw error;
    }
  },

  /**
   * Update an existing trip
   */
  async updateTrip(tripId, tripData) {
    try {
      return await prisma.trip.update({
        where: { id: tripId },
        data: {
          ...tripData,
          start_date: tripData.start_date ? new Date(tripData.start_date) : undefined,
          end_date: tripData.end_date ? new Date(tripData.end_date) : undefined,
        }
      });
    } catch (error) {
      console.error('Prisma Error updating trip:', error);
      throw error;
    }
  },

  /**
   * Delete a trip and its associated itinerary
   */
  async deleteTrip(tripId) {
    try {
      await prisma.trip.delete({
        where: { id: tripId }
      });
      return { message: 'Trip deleted successfully' };
    } catch (error) {
      console.error('Prisma Error deleting trip:', error);
      throw error;
    }
  }
};

module.exports = tripService;

