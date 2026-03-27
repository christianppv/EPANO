import * as AppleAuthentication from 'expo-apple-authentication';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSignIn } from '@/features/auth/use-sign-in';
import { colors, spacing, typography } from '@/theme';

export default function LoginScreen() {
  const { signInWithApple, signInWithGoogle, loading, error, appleAvailable } = useSignIn();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ position: 'absolute', top: -80, right: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: '#FFD08A', opacity: 0.35 }} />
      <View style={{ position: 'absolute', bottom: -100, left: -60, width: 220, height: 220, borderRadius: 110, backgroundColor: colors.accentSoft, opacity: 0.8 }} />

      <View style={{ flex: 1, paddingHorizontal: spacing.lg, justifyContent: 'space-between', paddingTop: spacing.xxl, paddingBottom: spacing.xl }}>
        <View style={{ alignItems: 'center', gap: spacing.md }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              backgroundColor: colors.text,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: colors.black,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              elevation: 4,
            }}
          >
            <Text style={{ fontSize: 32 }}>✈️</Text>
          </View>
          <Text style={{ ...typography.display, color: colors.text, textAlign: 'center' }}>
            EPANO
          </Text>
          <Text style={{ ...typography.body, color: colors.textSecondary, textAlign: 'center', maxWidth: 260 }}>
            Gruppenreisen planen, die sich gut anfühlen.
          </Text>
        </View>

        <View style={{ gap: spacing.sm }}>
          {error ? (
            <View style={{ backgroundColor: '#FEF2F2', borderRadius: 10, padding: spacing.sm, marginBottom: spacing.sm }}>
              <Text style={{ ...typography.caption, color: '#EF4444', textAlign: 'center' }}>{error}</Text>
            </View>
          ) : null}

          {loading ? (
            <View style={{ alignItems: 'center', paddingVertical: spacing.lg }}>
              <ActivityIndicator color={colors.text} />
            </View>
          ) : (
            <>
              {appleAvailable && (
                <AppleAuthentication.AppleAuthenticationButton
                  buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                  buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                  cornerRadius={14}
                  style={{ width: '100%', height: 52 }}
                  onPress={signInWithApple}
                />
              )}

              <Pressable
                onPress={signInWithGoogle}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing.sm,
                  backgroundColor: colors.white,
                  borderRadius: 14,
                  height: 52,
                  borderWidth: 1,
                  borderColor: colors.border,
                  opacity: pressed ? 0.75 : 1,
                  shadowColor: colors.black,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.06,
                  shadowRadius: 4,
                  elevation: 1,
                })}
              >
                <Text style={{ fontSize: 18 }}>G</Text>
                <Text style={{ ...typography.subheading, color: colors.text }}>
                  Mit Google anmelden
                </Text>
              </Pressable>
            </>
          )}

          <Text style={{ ...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm }}>
            Mit der Anmeldung stimmst du unseren Nutzungsbedingungen zu.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
