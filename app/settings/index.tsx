import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/use-auth-store';
import { colors, spacing, typography } from '@/theme';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    await supabase.auth.signOut();
    clear();
    router.replace('/auth/login');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.xl, gap: spacing.xl }}>
        <Text style={{ ...typography.heading, color: colors.text }}>Einstellungen</Text>

        {user?.email ? (
          <View style={{ backgroundColor: colors.white, borderRadius: 14, padding: spacing.md }}>
            <Text style={{ ...typography.caption, color: colors.textMuted, marginBottom: 2 }}>Angemeldet als</Text>
            <Text style={{ ...typography.body, color: colors.text }}>{user.email}</Text>
          </View>
        ) : null}

        <Pressable
          onPress={handleSignOut}
          disabled={loading}
          style={({ pressed }) => ({
            backgroundColor: colors.white,
            borderRadius: 14,
            padding: spacing.md,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={{ ...typography.body, color: '#EF4444' }}>Abmelden</Text>
          {loading ? <ActivityIndicator color="#EF4444" /> : null}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
