/**
 * Shared Type Definitions and Interfaces
 */

export interface Trip {
    id: string;
    user_id: string;
    title: string;
    start_date: string;
    end_date: string;
    created_at?: string;
}

export type ItemType = 'Flight' | 'Hotel' | 'Activity' | 'Food';

export interface ItineraryItem {
    id: string;
    trip_id: string;
    day: number;
    type: ItemType; 
    title: string;
    location?: string;
    time?: string;
    description?: string;
}

export interface ApiResponse<T> {
    data: T;
    error: string | null;
}
