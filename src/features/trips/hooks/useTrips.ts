import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/use-auth-store';
import { Trip } from '../types/trip.types';
import { dbTripToTrip } from '../utils/map-trip';

async function fetchTrips(): Promise<Trip[]> {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(dbTripToTrip);
}

export function useTrips(): { trips: Trip[]; isLoading: boolean; error: string | null } {
  const user = useAuthStore((s) => s.user);
  const query = useQuery({
    queryKey: ['trips', user?.id],
    queryFn: fetchTrips,
    enabled: !!user,
  });
  return {
    trips: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error ? 'Fehler beim Laden der Reisen.' : null,
  };
}

export function useTripById(id: string): Trip | undefined {
  const user = useAuthStore((s) => s.user);
  const query = useQuery({
    queryKey: ['trips', user?.id],
    queryFn: fetchTrips,
    enabled: !!user,
  });
  return query.data?.find((t) => t.id === id);
}
