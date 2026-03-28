import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export type PollOptionResult = {
  pollOptionId: string;
  optionId: string;
  optionTitle: string;
  yes: number;
  no: number;
  maybe: number;
};

export type Poll = {
  id: string;
  tripId: string;
  title: string;
  category: string | null;
  deadline: string | null;
  status: 'open' | 'closed';
  createdAt: string;
  totalVoters: number;
  results: PollOptionResult[];
};

async function fetchPolls(tripId: string): Promise<Poll[]> {
  const { data: rawPolls, error } = await supabase
    .from('polls')
    .select(`
      id, trip_id, title, category, deadline, status, created_at,
      poll_options ( id, option_id, options ( title ) ),
      votes ( id, poll_option_id, user_id, value )
    `)
    .eq('trip_id', tripId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (rawPolls ?? []).map((poll) => {
    const pollOptions: any[] = ((poll as any).poll_options ?? []) as any[];
    const allVotes: any[] = ((poll as any).votes ?? []) as any[];
    const voterIds = new Set<string>(allVotes.map((v) => v.user_id as string));

    const results: PollOptionResult[] = pollOptions.map((po) => {
      const oVotes = allVotes.filter((v) => v.poll_option_id === po.id);
      return {
        pollOptionId: po.id as string,
        optionId: po.option_id as string,
        optionTitle: (po.options?.title ?? 'Option') as string,
        yes: oVotes.filter((v) => v.value === 'yes').length,
        no: oVotes.filter((v) => v.value === 'no').length,
        maybe: oVotes.filter((v) => v.value === 'maybe').length,
      };
    });

    return {
      id: poll.id,
      tripId: poll.trip_id,
      title: poll.title,
      category: poll.category ?? null,
      deadline: poll.deadline ?? null,
      status: poll.status === 'closed' ? 'closed' : 'open',
      createdAt: poll.created_at,
      totalVoters: voterIds.size,
      results,
    };
  });
}

export function usePolls(tripId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`polls_votes_${tripId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'polls', filter: `trip_id=eq.${tripId}` },
        () => { queryClient.invalidateQueries({ queryKey: ['polls', tripId] }); }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'votes' },
        () => { queryClient.invalidateQueries({ queryKey: ['polls', tripId] }); }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [tripId, queryClient]);

  const query = useQuery({
    queryKey: ['polls', tripId],
    queryFn: () => fetchPolls(tripId),
    enabled: !!tripId,
  });

  return {
    polls: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error ? 'Fehler beim Laden der Abstimmungen.' : null,
  };
}
