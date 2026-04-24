const tripService = require('./services/tripService');
const prisma = require('./config/db');

async function testConnection() {
  console.log('🚀 Starting Database Test...');
  
  try {
    // 1. Create a test trip
    console.log('📝 Creating a test trip...');
    const newTrip = await tripService.createTrip({
      user_id: 'test-user-123',
      title: 'Test Adventure to Paris',
      start_date: '2026-06-01',
      end_date: '2026-06-10'
    });
    console.log('✅ Trip created successfully:', newTrip);

    // 2. Fetch the trip back
    console.log('🔍 Fetching trips for user...');
    const userTrips = await tripService.getTripsByUser('test-user-123');
    console.log(`✅ Found ${userTrips.length} trip(s).`);
    console.log('First trip details:', userTrips[0]);

    // 3. Cleanup (optional, but good for testing)
    console.log('🧹 Cleaning up test data...');
    await tripService.deleteTrip(newTrip.id);
    console.log('✅ Test data cleaned up.');

    console.log('\n✨ ALL TESTS PASSED! Your MongoDB connection is perfect.');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
