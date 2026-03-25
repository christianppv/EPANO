import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';

const BENEFITS = [
  'Reiseziele gemeinsam vorschlagen und abstimmen',
  'Kosten transparent planen und aufteilen',
  'Einen klaren Reiseplan für alle im Blick behalten',
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, paddingHorizontal: spacing.lg, paddingVertical: spacing.xl }}>
        {/* Brand area */}
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text
            style={{
              ...typography.display,
              color: colors.text,
              marginBottom: spacing.sm,
            }}
          >
            EPANO
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '500',
              color: colors.textSecondary,
              lineHeight: 28,
              marginBottom: spacing.xl,
            }}
          >
            Plane Gruppenreisen{'\n'}ohne Chat-Chaos.
          </Text>

          {/* Benefits */}
          <View style={{ gap: spacing.sm }}>
            {BENEFITS.map((benefit, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }}>
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: colors.accent,
                    marginTop: 8,
                  }}
                />
                <Text style={{ ...typography.body, color: colors.textSecondary, flex: 1 }}>
                  {benefit}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTA */}
        <View style={{ paddingBottom: spacing.md }}>
          <Link href="/trips" asChild>
            <Pressable
              style={({ pressed }) => ({
                backgroundColor: colors.text,
                paddingVertical: spacing.md,
                borderRadius: 14,
                alignItems: 'center',
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text style={{ ...typography.subheading, color: colors.white }}>
                Los geht's →
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
