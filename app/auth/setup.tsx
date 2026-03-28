import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/use-auth-store';
import { colors, spacing, typography } from '@/theme';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SetupScreen() {
  const user = useAuthStore((s) => s.user);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleContinue() {
    if (!name.trim() || !user) return;
    setLoading(true);
    setError(null);
    const { error: err } = await supabase
      .from('profiles')
      .update({ name: name.trim() })
      .eq('id', user.id);
    if (err) {
      setError('Fehler beim Speichern. Bitte erneut versuchen.');
      setLoading(false);
      return;
    }
    router.replace('/trips');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ flex: 1, paddingHorizontal: spacing.lg, justifyContent: 'center', gap: spacing.lg }}>
          <View style={{ gap: spacing.sm }}>
            <Text style={{ ...typography.heading, color: colors.text }}>Wie heißt du?</Text>
            <Text style={{ ...typography.body, color: colors.textSecondary }}>
              Dein Name ist für alle Mitglieder deiner Reisen sichtbar.
            </Text>
          </View>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Dein Name"
            placeholderTextColor={colors.textMuted}
            autoFocus
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={handleContinue}
            style={{
              backgroundColor: colors.white,
              borderRadius: 14,
              height: 52,
              paddingHorizontal: spacing.md,
              borderWidth: 1,
              borderColor: '#C8C4BE',
              ...typography.body,
              color: colors.text,
            }}
          />

          {error ? (
            <Text style={{ ...typography.caption, color: '#EF4444', textAlign: 'center' }}>{error}</Text>
          ) : null}

          <Pressable
            onPress={handleContinue}
            disabled={loading || !name.trim()}
            style={({ pressed }) => ({
              backgroundColor: loading || !name.trim() ? colors.textMuted : colors.accent,
              borderRadius: 14,
              height: 52,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.85 : 1,
            })}
          >
            {loading
              ? <ActivityIndicator color={colors.white} />
              : <Text style={{ ...typography.subheading, color: colors.white }}>Weiter</Text>
            }
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
