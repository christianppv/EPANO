import { TripList } from '@/features/trips/components/trip-list';
import { useTrips } from '@/features/trips/hooks/useTrips';
import { Trip } from '@/features/trips/types/trip.types';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/use-auth-store';
import { colors, spacing, typography } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TripsScreen() {
  const { trips, isLoading, error } = useTrips();
  const user = useAuthStore((s) => s.user);
  const [profileName, setProfileName] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('name').eq('id', user.id).single()
      .then(({ data }) => { if (data?.name) setProfileName(data.name); });
  }, [user?.id]);

  function handleTripPress(trip: Trip) {
    router.push(`/trips/${trip.id}`);
  }

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ ...typography.body, color: colors.textMuted }}>Lade Reisen…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ ...typography.body, color: colors.textMuted }}>
            Fehler beim Laden der Reisen.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        {/* Screen header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.lg,
          }}
        >
          <View>
            {profileName && (
              <Text style={{ ...typography.caption, color: colors.textSecondary }}>Hallo {profileName} 👋</Text>
            )}
            <Text style={{ ...typography.heading, color: colors.text }}>Meine Reisen</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'center' }}>
            <Pressable
              onPress={() => router.push('/settings')}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, padding: 4 })}
              hitSlop={10}
            >
              <Ionicons name="settings-outline" size={22} color={colors.textSecondary} />
            </Pressable>
            <Pressable
              onPress={() => router.push('/trips/create')}
              style={({ pressed }) => ({
                backgroundColor: colors.accent,
                width: 36,
                height: 36,
                borderRadius: 18,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text style={{ color: colors.white, fontSize: 22, fontWeight: '300', lineHeight: 26 }}>+</Text>
            </Pressable>
          </View>
        </View>

        <TripList trips={trips} onTripPress={handleTripPress} />
      </ScrollView>
    </SafeAreaView>
  );
}
