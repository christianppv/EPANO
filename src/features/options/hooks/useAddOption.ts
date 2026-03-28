import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/use-auth-store';
import { parseLinkUrl } from '../services/parse-link';

type AddOptionInput = {
  tripId: string;
  url: string;
};

export function useAddOption() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const mutation = useMutation({
    mutationFn: async ({ tripId, url }: AddOptionInput) => {
      if (!user?.id) {
        throw new Error('Nicht eingeloggt — Option kann nicht hinzugefügt werden.');
      }

      // parseLinkUrl never throws — graceful degradation is guaranteed in the service
      const parsed = await parseLinkUrl(url);

      const { data, error } = await supabase
        .from('options')
        .insert({
          trip_id: tripId,
          url: parsed.url,
          title: parsed.title,
          image_url: parsed.imageUrl ?? undefined,
          price: parsed.price ?? undefined,
          rating: parsed.rating ?? undefined,
          source_domain: parsed.sourceDomain ?? undefined,
          category: parsed.category,
          notes: parsed.notes ?? undefined,
          added_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['options', variables.tripId] });
    },
  });

  return {
    addOption: mutation.mutateAsync,
    isParsing: mutation.isPending,
    error: mutation.error ? 'Option konnte nicht hinzugefügt werden.' : null,
    reset: mutation.reset,
  };
}
