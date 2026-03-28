import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useSignIn } from '@/features/auth/use-sign-in';
import { colors, spacing, typography } from '@/theme';

export default function LoginScreen() {
  const { sendOtp, verifyOtp, loading, error, sent } = useSignIn();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ position: 'absolute', top: -80, right: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: '#FFD08A', opacity: 0.35 }} />
      <View style={{ position: 'absolute', bottom: -100, left: -60, width: 220, height: 220, borderRadius: 110, backgroundColor: colors.accentSoft, opacity: 0.8 }} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ flex: 1, paddingHorizontal: spacing.lg, justifyContent: 'space-between', paddingTop: spacing.xxl, paddingBottom: spacing.xl }}>

          {/* Brand */}
          <View style={{ alignItems: 'center', gap: spacing.md }}>
            <View style={{ width: 72, height: 72, borderRadius: 20, backgroundColor: colors.text, justifyContent: 'center', alignItems: 'center', shadowColor: colors.black, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 4 }}>
              <Text style={{ fontSize: 32 }}>✈️</Text>
            </View>
            <Text style={{ ...typography.display, color: colors.text, textAlign: 'center' }}>EPANO</Text>
            <Text style={{ ...typography.body, color: colors.textSecondary, textAlign: 'center', maxWidth: 260 }}>
              Gruppenreisen planen, die sich gut anfühlen.
            </Text>
          </View>

          {/* Form */}
          <View style={{ gap: spacing.sm }}>
            {error ? (
              <View style={{ backgroundColor: '#FEF2F2', borderRadius: 10, padding: spacing.sm }}>
                <Text style={{ ...typography.caption, color: '#EF4444', textAlign: 'center' }}>{error}</Text>
              </View>
            ) : null}

            {!sent ? (
              <>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="deine@email.de"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ backgroundColor: colors.white, borderRadius: 14, height: 52, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.border, ...typography.body, color: colors.text }}
                />
                <Pressable
                  onPress={() => sendOtp(email)}
                  disabled={loading || !email.trim()}
                  style={({ pressed }) => ({ backgroundColor: loading || !email.trim() ? colors.textMuted : colors.accent, borderRadius: 14, height: 52, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.85 : 1 })}
                >
                  {loading
                    ? <ActivityIndicator color={colors.white} />
                    : <Text style={{ ...typography.subheading, color: colors.white }}>Code senden</Text>
                  }
                </Pressable>
              </>
            ) : (
              <>
                <Text style={{ ...typography.body, color: colors.textSecondary, textAlign: 'center' }}>
                  Wir haben einen 8-stelligen Code an{'\n'}<Text style={{ fontWeight: '600', color: colors.text }}>{email}</Text> geschickt.
                </Text>
                <TextInput
                  value={code}
                  onChangeText={setCode}
                  placeholder="12345678"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="number-pad"
                  autoFocus
                  maxLength={8}
                  style={{ backgroundColor: colors.white, borderRadius: 14, height: 52, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.border, ...typography.heading, color: colors.text, textAlign: 'center', letterSpacing: 8 }}
                />
                <Pressable
                  onPress={() => verifyOtp(code)}
                  disabled={loading || code.length < 8}
                  style={({ pressed }) => ({ backgroundColor: loading || code.length < 8 ? colors.textMuted : colors.accent, borderRadius: 14, height: 52, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.85 : 1 })}
                >
                  {loading
                    ? <ActivityIndicator color={colors.white} />
                    : <Text style={{ ...typography.subheading, color: colors.white }}>Anmelden</Text>
                  }
                </Pressable>
                <Pressable onPress={() => { setCode(''); }} style={{ alignItems: 'center' }}>
                  <Text style={{ ...typography.caption, color: colors.textMuted }}>Anderen Code eingeben</Text>
                </Pressable>
              </>
            )}

            <Text style={{ ...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm }}>
              Mit der Anmeldung stimmst du unseren Nutzungsbedingungen zu.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
