import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { getTrips } from '../store/trips.store';
import { Trip } from '../types/trip.types';

export function useTrips(): { trips: Trip[]; isLoading: boolean; error: string | null } {
  const [trips, setTrips] = useState<Trip[]>(getTrips());

  useFocusEffect(
    useCallback(() => {
      setTrips(getTrips());
    }, [])
  );

  return { trips, isLoading: false, error: null };
}

export function useTripById(id: string): Trip | undefined {
  return getTrips().find((trip) => trip.id === id);
}
