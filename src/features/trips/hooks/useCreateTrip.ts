import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { CreateTripInput } from '../types/create-trip.input';
import { Trip } from '../types/trip.types';
import { dbTripToTrip } from '../utils/map-trip';

export function useCreateTrip(): { createTrip: (input: CreateTripInput) => Promise<Trip> } {
  const queryClient = useQueryClient();

  async function createTrip(input: CreateTripInput): Promise<Trip> {
    const { data, error } = await supabase.rpc('create_trip', {
      p_name: input.title.trim(),
      p_destination: input.destination.trim(),
      p_date_from: input.startDate ?? null,
      p_date_to: input.endDate ?? null,
      p_planned_members: input.memberCount,
    });

    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Reise konnte nicht erstellt werden');

    await queryClient.invalidateQueries({ queryKey: ['trips'] });
    return dbTripToTrip(data[0]);
  }

  return { createTrip };
}
