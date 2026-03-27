import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Share, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTripById } from '@/features/trips/hooks/useTrips';
import { colors, spacing, typography } from '@/theme';

const SECTIONS = [
  { key: 'suggestions', label: 'Vorschläge', description: 'Ziele und Aktivitäten vorschlagen' },
  { key: 'voting', label: 'Abstimmung', description: 'Gemeinsam über Vorschläge abstimmen' },
  { key: 'expenses', label: 'Ausgaben', description: 'Kosten grob planen und aufteilen' },
  { key: 'itinerary', label: 'Reiseplan', description: 'Tagesplan und Aktivitäten organisieren' },
];

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trip = useTripById(id);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, marginRight: spacing.md })}
          hitSlop={12}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={{ ...typography.heading, color: colors.text }}>
            {trip?.destination ?? 'Reise'}
          </Text>
          {trip && (
            <Text style={{ ...typography.caption, color: colors.textMuted, marginTop: 1 }}>
              {trip.title}
            </Text>
          )}
        </View>
        {trip && (
          <Pressable
            onPress={() =>
              Share.share({
                message: `Tritt unserer Reise bei! Code: ${trip.inviteCode}\nLink: https://epano.app/join/${trip.inviteCode}`,
              })
            }
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, marginLeft: spacing.md })}
            hitSlop={12}
          >
            <Ionicons name="share-outline" size={22} color={colors.text} />
          </Pressable>
        )}
      </View>

      {/* Sections */}
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.sm + 4 }}>
        {SECTIONS.map((section) => (
          <View
            key={section.key}
            style={{
              backgroundColor: colors.white,
              borderRadius: 14,
              padding: spacing.md,
              shadowColor: colors.black,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 3,
              elevation: 1,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ ...typography.subheading, color: colors.text }}>{section.label}</Text>
              <View
                style={{
                  backgroundColor: colors.backgroundCard,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 3,
                  borderRadius: 6,
                }}
              >
                <Text style={{ ...typography.caption, color: colors.textMuted }}>Bald verfügbar</Text>
              </View>
            </View>
            <Text style={{ ...typography.caption, color: colors.textMuted, marginTop: 4 }}>
              {section.description}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
