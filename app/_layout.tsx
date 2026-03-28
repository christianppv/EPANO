import '@/lib/polyfills';
import { queryClient } from '@/lib/query-client';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/use-auth-store';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

WebBrowser.maybeCompleteAuthSession();

function AuthGate() {
  const { session, isLoading, setSession } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => setSession(s));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, s) => {
      setSession(s);
      if (event === 'SIGNED_IN' && s?.user) {
        await supabase.from('profiles').upsert(
          {
            id: s.user.id,
            email: s.user.email ?? undefined,
            name: s.user.user_metadata?.full_name ?? s.user.user_metadata?.name ?? undefined,
            avatar_url: s.user.user_metadata?.avatar_url ?? undefined,
          },
          { onConflict: 'id' }
        );
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const inAuth = segments[0] === 'auth';
    const atRoot = (segments as string[]).length === 0;

    if (!session && !inAuth) {
      router.replace('/auth/login');
    } else if (session && (inAuth || atRoot)) {
      supabase.from('profiles').select('name').eq('id', session.user.id).single().then(({ data }) => {
        if (!data?.name) {
          router.replace('/auth/setup');
        } else {
          router.replace('/trips');
        }
      });
    }
  }, [session, isLoading, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AuthGate />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
