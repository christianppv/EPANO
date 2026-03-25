// Demo/session bridge only — not a production architecture pattern.
// Replaced by a real backend store (Supabase, etc.) in a future slice.
import { MOCK_TRIPS } from '../data/trip.mock';
import { Trip } from '../types/trip.types';

let _trips: Trip[] = [...MOCK_TRIPS];

export function getTrips(): Trip[] {
  return [..._trips];
}

export function addTrip(trip: Trip): void {
  _trips = [..._trips, trip];
}
