import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/use-auth-store';
import { CreateTripInput } from '../types/create-trip.input';
import { Trip } from '../types/trip.types';
import { dbTripToTrip } from '../utils/map-trip';
import { parseGermanDate } from '../utils/parse-date-input';

export function useCreateTrip(): { createTrip: (input: CreateTripInput) => Promise<Trip> } {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  async function createTrip(input: CreateTripInput): Promise<Trip> {
    if (!user) throw new Error('Not authenticated');

    const startIso = input.startDate ? parseGermanDate(input.startDate) : null;
    const endIso = input.endDate ? parseGermanDate(input.endDate) : null;

    const { data: row, error } = await supabase
      .from('trips')
      .insert({
        name: input.title.trim(),
        destination: input.destination.trim(),
        date_from: startIso,
        date_to: endIso,
        planned_members: input.memberCount,
        created_by: user.id,
        status: 'planning',
      })
      .select()
      .single();

    if (error) throw error;

    await supabase.from('trip_members').insert({
      trip_id: row.id,
      user_id: user.id,
      role: 'organizer',
    });

    await queryClient.invalidateQueries({ queryKey: ['trips'] });
    return dbTripToTrip(row);
  }

  return { createTrip };
}
