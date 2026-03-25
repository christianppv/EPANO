import { MOCK_TRIPS } from '../data/trip.mock';

export function useTrips() {
  return {
    trips: MOCK_TRIPS,
    isLoading: false,
    error: null,
  };
}