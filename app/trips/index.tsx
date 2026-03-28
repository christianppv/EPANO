import { TripList } from '@/features/trips/components/trip-list';
import { useTrips } from '@/features/trips/hooks/useTrips';
import { Trip } from '@/features/trips/types/trip.types';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/use-auth-store';
import { LiquidBackground } from '@/components/ui/liquid-background';
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
  }, [user]);

  function handleTripPress(trip: Trip) {
    router.push(`/trips/${trip.id}`);
  }

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <LiquidBackground>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ ...typography.body, color: colors.textMuted }}>Lade Reisen…</Text>
          </View>
        </LiquidBackground>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <LiquidBackground>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ ...typography.body, color: colors.textMuted }}>
              Fehler beim Laden der Reisen.
            </Text>
          </View>
        </LiquidBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <LiquidBackground>
        <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: 80 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: spacing.md,
            }}
          >
            <View>
              {profileName && (
                <Text style={{ ...typography.caption, color: colors.textMuted, fontSize: 14 }}>
                  Hallo {profileName} 👋
                </Text>
              )}
              <Text style={{ ...typography.heading, color: colors.text, fontSize: 24, lineHeight: 30 }}>
                Deine Trips
              </Text>
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
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: pressed ? 0.9 : 1,
                  backgroundColor: colors.primary,
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.35,
                  shadowRadius: 14,
                  elevation: 5,
                })}
              >
                <Text style={{ color: colors.white, fontSize: 24, fontWeight: '300', lineHeight: 26 }}>+</Text>
              </Pressable>
            </View>
          </View>

          <TripList
            trips={trips}
            onTripPress={handleTripPress}
            onCreatePress={() => router.push('/trips/create')}
          />
        </ScrollView>
      </LiquidBackground>
    </SafeAreaView>
  );
}
