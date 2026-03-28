import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export type TripMember = {
  userId: string;
  role: 'organizer' | 'member';
  name: string;
  avatarUrl: string | null;
};

async function fetchMembers(tripId: string): Promise<TripMember[]> {
  const { data, error } = await supabase
    .from('trip_members')
    .select('user_id, role, profiles(name, avatar_url)')
    .eq('trip_id', tripId);
  if (error) throw error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => ({
    userId: row.user_id,
    role: row.role as 'organizer' | 'member',
    name: row.profiles?.name ?? 'Unbekannt',
    avatarUrl: row.profiles?.avatar_url ?? null,
  }));
}

export function useTripMembers(tripId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`trip_members_${tripId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trip_members', filter: `trip_id=eq.${tripId}` },
        () => queryClient.invalidateQueries({ queryKey: ['trip_members', tripId] })
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [tripId]);

  const query = useQuery({
    queryKey: ['trip_members', tripId],
    queryFn: () => fetchMembers(tripId),
    enabled: !!tripId,
  });

  return {
    members: query.data ?? [],
    isLoading: query.isLoading,
  };
}
