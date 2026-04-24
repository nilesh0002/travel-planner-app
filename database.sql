-- Create trips table
CREATE TABLE trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create itinerary_items table
CREATE TABLE itinerary_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  day INTEGER NOT NULL,
  type TEXT, -- e.g., 'Flight', 'Hotel', 'Activity'
  title TEXT NOT NULL,
  location TEXT,
  time TIME,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_items ENABLE ROW LEVEL SECURITY;

-- Policies for trips
CREATE POLICY "Users can view their own trips" ON trips
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trips" ON trips
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips" ON trips
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips" ON trips
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for itinerary_items
CREATE POLICY "Users can view itinerary for their trips" ON itinerary_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = itinerary_items.trip_id
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add itinerary to their trips" ON itinerary_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = itinerary_items.trip_id
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their itinerary items" ON itinerary_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = itinerary_items.trip_id
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their itinerary items" ON itinerary_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = itinerary_items.trip_id
      AND trips.user_id = auth.uid()
    )
  );
