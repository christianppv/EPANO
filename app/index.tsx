import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';

const BENEFITS = [
  'Gemeinsam Reiseideen sammeln und bewerten',
  'Vorfreude sichtbar machen statt sie im Chat zu verlieren',
  'Kosten und Planung in einem ruhigen Ort bündeln',
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, overflow: 'hidden' }}>
        <View
          style={{
            position: 'absolute',
            top: -90,
            right: -70,
            width: 220,
            height: 220,
            borderRadius: 110,
            backgroundColor: '#FFD08A',
            opacity: 0.38,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 120,
            left: -90,
            width: 180,
            height: 180,
            borderRadius: 90,
            backgroundColor: colors.accentSoft,
            opacity: 0.9,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: -110,
            right: -30,
            width: 240,
            height: 240,
            borderRadius: 120,
            backgroundColor: '#DFF6F0',
            opacity: 0.9,
          }}
        />

        <View style={{ flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.lg }}>
          {/* Brand area */}
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View>
              <View
                style={{
                  alignSelf: 'flex-start',
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: 'rgba(15, 15, 15, 0.08)',
                  marginBottom: spacing.lg,
                }}
              >
                <Text style={{ ...typography.caption, fontWeight: '700', color: colors.text }}>
                  EPANO
                </Text>
              </View>

              <Text
                style={{
                  ...typography.display,
                  color: colors.text,
                  marginBottom: spacing.md,
                  maxWidth: 320,
                }}
              >
                Reisen planen, die sich schon gut anfühlen.
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '500',
                  color: colors.textSecondary,
                  lineHeight: 26,
                  marginBottom: spacing.lg,
                  maxWidth: 320,
                }}
              >
                EPANO bringt Vorschläge, Entscheidungen und Kosten an einen Ort - damit aus
                Gruppenchats wieder Vorfreude wird.
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: spacing.sm,
                  marginBottom: spacing.lg,
                }}
              >
                {['Vorfreude', 'Klarheit', 'Gemeinsam'].map((label) => (
                  <View
                    key={label}
                    style={{
                      backgroundColor: colors.white,
                      borderRadius: 999,
                      paddingHorizontal: spacing.md,
                      paddingVertical: 8,
                      shadowColor: colors.black,
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.04,
                      shadowRadius: 3,
                      elevation: 1,
                    }}
                  >
                    <Text style={{ ...typography.caption, fontWeight: '600', color: colors.text }}>
                      {label}
                    </Text>
                  </View>
                ))}
              </View>

              <View
                style={{
                  backgroundColor: colors.white,
                  borderRadius: 20,
                  padding: spacing.md,
                  shadowColor: colors.black,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.08,
                  shadowRadius: 16,
                  elevation: 3,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: colors.accentSoft,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: spacing.sm,
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>✈</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ ...typography.subheading, color: colors.text }}>
                      Dein gemeinsamer Trip-Start
                    </Text>
                    <Text style={{ ...typography.caption, color: colors.textMuted, marginTop: 2 }}>
                      Ideen sammeln, abstimmen, loslegen.
                    </Text>
                  </View>
                </View>

                <View style={{ gap: spacing.sm }}>
                  {BENEFITS.map((benefit, index) => (
                    <View
                      key={index}
                      style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }}
                    >
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: index === 0 ? colors.accent : '#F5A623',
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
            </View>

            {/* CTA */}
            <View style={{ paddingTop: spacing.xl }}>
              <Link href="/trips" asChild>
                <Pressable
                  style={({ pressed }) => ({
                    backgroundColor: colors.text,
                    paddingVertical: spacing.md,
                    borderRadius: 16,
                    alignItems: 'center',
                    opacity: pressed ? 0.88 : 1,
                    shadowColor: colors.black,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.16,
                    shadowRadius: 14,
                    elevation: 4,
                  })}
                >
                  <Text style={{ ...typography.subheading, color: colors.white }}>
                    Los geht&apos;s
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
