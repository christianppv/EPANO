import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { colors, spacing, typography } from '@/theme';

type TripPreview = {
  id: string;
  name: string;
  destination: string;
  status: string;
  invite_code: string;
};

export default function JoinScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const [preview, setPreview] = useState<TripPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .rpc('get_trip_by_invite_code', { p_code: code })
      .then(({ data, error: rpcError }) => {
        if (rpcError || !data || data.length === 0) {
          setError('Einladungslink nicht gefunden.');
        } else {
          setPreview(data[0] as TripPreview);
        }
        setLoading(false);
      });
  }, [code]);

  async function handleJoin() {
    setJoining(true);
    const { data: tripId, error: rpcError } = await supabase.rpc('join_trip_by_invite_code', {
      p_code: code,
    });
    if (rpcError) {
      setError('Beitreten fehlgeschlagen. Bitte erneut versuchen.');
      setJoining(false);
      return;
    }
    router.replace(`/trips/${tripId}`);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg }}>
        {loading ? (
          <ActivityIndicator color={colors.accent} />
        ) : error ? (
          <View style={{ alignItems: 'center', gap: spacing.md }}>
            <Ionicons name="alert-circle-outline" size={40} color={colors.textMuted} />
            <Text style={{ ...typography.body, color: colors.textSecondary, textAlign: 'center' }}>
              {error}
            </Text>
            <Pressable onPress={() => router.replace('/')}>
              <Text style={{ ...typography.body, color: colors.accent }}>Zur Startseite</Text>
            </Pressable>
          </View>
        ) : preview ? (
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: 20,
              padding: spacing.lg,
              width: '100%',
              shadowColor: colors.black,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 3,
              gap: spacing.md,
            }}
          >
            <View style={{ alignItems: 'center', gap: spacing.sm }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: colors.accentSoft,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 26 }}>✈️</Text>
              </View>
              <Text style={{ ...typography.heading, color: colors.text, textAlign: 'center' }}>
                {preview.destination}
              </Text>
              <Text style={{ ...typography.body, color: colors.textSecondary, textAlign: 'center' }}>
                {preview.name}
              </Text>
            </View>

            <Pressable
              onPress={handleJoin}
              disabled={joining}
              style={({ pressed }) => ({
                backgroundColor: joining ? colors.textMuted : colors.text,
                paddingVertical: spacing.md,
                borderRadius: 14,
                alignItems: 'center',
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text style={{ ...typography.subheading, color: colors.white }}>
                {joining ? 'Wird beigetreten…' : 'Reise beitreten'}
              </Text>
            </Pressable>

            <Pressable onPress={() => router.replace('/')} style={{ alignItems: 'center' }}>
              <Text style={{ ...typography.caption, color: colors.textMuted }}>Abbrechen</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
