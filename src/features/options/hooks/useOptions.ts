import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Option, OptionCategory, OptionStatus } from '../types/option.types';

const VALID_CATEGORIES: OptionCategory[] = ['accommodation', 'flight', 'activity', 'car', 'other'];
const VALID_STATUSES: OptionStatus[] = ['active', 'decided', 'rejected'];

function toCategory(value: string | null): OptionCategory {
  if (value && VALID_CATEGORIES.includes(value as OptionCategory)) return value as OptionCategory;
  return 'other';
}

function toStatus(value: string | null): OptionStatus {
  if (value && VALID_STATUSES.includes(value as OptionStatus)) return value as OptionStatus;
  return 'active';
}

async function fetchOptions(tripId: string): Promise<Option[]> {
  const { data, error } = await supabase
    .from('options')
    .select('*')
    .eq('trip_id', tripId)
    .neq('status', 'rejected')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    tripId: row.trip_id,
    url: row.url,
    title: row.title ?? row.url ?? 'Option',
    imageUrl: row.image_url,
    price: row.price,
    rating: row.rating,
    sourceDomain: row.source_domain,
    category: toCategory(row.category),
    notes: row.notes,
    addedBy: row.added_by,
    status: toStatus(row.status),
    createdAt: row.created_at,
  }));
}

export function useOptions(tripId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`options_${tripId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'options', filter: `trip_id=eq.${tripId}` },
        () => { queryClient.invalidateQueries({ queryKey: ['options', tripId] }); }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [tripId, queryClient]);

  const query = useQuery({
    queryKey: ['options', tripId],
    queryFn: () => fetchOptions(tripId),
    enabled: !!tripId,
  });

  return {
    options: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error ? 'Fehler beim Laden der Optionen.' : null,
  };
}
