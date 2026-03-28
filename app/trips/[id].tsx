import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Share, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AvatarStack } from '@/components/common/avatar-stack';
import { Avatar } from '@/components/common/avatar';
import { GlassCard } from '@/components/ui/glass-card';
import { useTripById } from '@/features/trips/hooks/useTrips';
import { useTripMembers } from '@/features/trips/hooks/useTripMembers';
import { colors, spacing, typography } from '@/theme';

const MONTHS_SHORT = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()}. ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trip = useTripById(id);
  const { members } = useTripMembers(id);

  function handleShare() {
    if (!trip) return;
    Share.share({
      message: `Tritt unserer Reise "${trip.destination}" bei!\n\nepano://join/${trip.inviteCode}`,
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
        borderBottomWidth: 1, borderBottomColor: colors.backgroundCard,
      }}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, marginRight: spacing.md })} hitSlop={12}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={{ ...typography.heading, color: colors.text }} numberOfLines={1}>
            {trip?.destination ?? '—'}
          </Text>
          {trip?.title && (
            <Text style={{ ...typography.caption, color: colors.textMuted, marginTop: 1 }}>
              {trip.title}
            </Text>
          )}
        </View>
        <Pressable onPress={handleShare} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, marginLeft: spacing.md })} hitSlop={12}>
          <Ionicons name="share-outline" size={22} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl }}>

        {/* Trip info card */}
        {trip && (
          <GlassCard style={{ padding: spacing.md, gap: spacing.sm }}>
            {(trip.startDate || trip.endDate) && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                <Text style={{ ...typography.body, color: colors.textSecondary }}>
                  {formatDate(trip.startDate)}
                  {trip.endDate !== trip.startDate ? ` – ${formatDate(trip.endDate)}` : ''}
                </Text>
              </View>
            )}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
              <Text style={{ ...typography.body, color: colors.textSecondary }}>
                {trip.memberCount} geplante Mitglieder
              </Text>
            </View>
          </GlassCard>
        )}

        {/* Members section */}
        <View style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ ...typography.subheading, color: colors.text }}>Mitglieder</Text>
            <Pressable
              onPress={handleShare}
              style={({ pressed }) => ({
                flexDirection: 'row', alignItems: 'center', gap: 4,
                backgroundColor: colors.accent, paddingHorizontal: spacing.md,
                paddingVertical: 6, borderRadius: 20, opacity: pressed ? 0.8 : 1,
              })}
            >
              <Ionicons name="person-add-outline" size={13} color={colors.white} />
              <Text style={{ ...typography.caption, fontWeight: '600', color: colors.white }}>Einladen</Text>
            </Pressable>
          </View>

          <GlassCard style={{ padding: spacing.md }}>
            {members.length === 0 ? (
              <Text style={{ ...typography.body, color: colors.textMuted }}>Noch keine Mitglieder</Text>
            ) : (
              <View style={{ gap: spacing.sm }}>
                {members.map((m) => (
                  <View key={m.userId} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                    <Avatar name={m.name} size={32} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ ...typography.body, color: colors.text }}>{m.name}</Text>
                      <Text style={{ ...typography.caption, color: colors.textMuted }}>
                        {m.role === 'organizer' ? 'Organisator' : 'Mitglied'}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </GlassCard>
        </View>

        {/* Options placeholder */}
        <View style={{ gap: spacing.sm }}>
          <Text style={{ ...typography.subheading, color: colors.text }}>Vorschläge</Text>
          <GlassCard style={{ padding: spacing.xl, alignItems: 'center', gap: spacing.sm }}>
            <Text style={{ fontSize: 32 }}>🔗</Text>
            <Text style={{ ...typography.body, color: colors.textSecondary, textAlign: 'center' }}>
              Noch keine Vorschläge
            </Text>
            <Text style={{ ...typography.caption, color: colors.textMuted, textAlign: 'center' }}>
              Links hinzufügen kommt in Kürze
            </Text>
          </GlassCard>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
