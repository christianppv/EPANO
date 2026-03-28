import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '@/components/ui/glass-card';
import { LiquidBackground } from '@/components/ui/liquid-background';
import { DatePickerField } from '@/components/ui/date-picker-field';
import { LabeledInput } from '@/components/ui/labeled-input';
import { useCreateTrip } from '@/features/trips/hooks/useCreateTrip';
import { colors, spacing, typography } from '@/theme';

type FormErrors = {
  title?: string;
};

export default function CreateTripScreen() {
  const { createTrip } = useCreateTrip();

  const [destination, setDestination] = useState('');
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function validate(): boolean {
    const next: FormErrors = {};

    if (title.trim().length < 2) {
      next.title = 'Bitte gib einen Tripnamen mit mindestens 2 Zeichen ein.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const normalizedTitle = title.trim();
      const normalizedDestination = destination.trim() || normalizedTitle;
      const trip = await createTrip({
        destination: normalizedDestination,
        title: normalizedTitle,
        startDate: startDate ?? undefined,
        endDate: endDate ?? undefined,
        memberCount: 4,
      });
      router.replace(`/trips/${trip.id}`);
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message ?? 'Unbekannter Fehler';
      setSubmitError(`Fehler: ${msg}`);
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <LiquidBackground>
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.md,
            }}
          >
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, marginRight: spacing.md })}
              hitSlop={12}
            >
              <Ionicons name="arrow-back" size={22} color={colors.primary} />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text style={{ ...typography.heading, color: colors.text }}>Trip erstellen</Text>
              <Text style={{ ...typography.caption, color: colors.textMuted }}>
                In weniger als 10 Sekunden startklar.
              </Text>
            </View>
          </View>

          {/* Form */}
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xxl }}
            keyboardShouldPersistTaps="handled"
          >
            <GlassCard style={{ padding: spacing.md, gap: spacing.md, marginBottom: spacing.md }}>
              <LabeledInput
                label="Trip-Name"
                value={title}
                onChangeText={(v) => {
                  setTitle(v);
                  if (errors.title) setErrors((e) => ({ ...e, title: undefined }));
                }}
                placeholder="z.B. Lissabon Sommer"
                autoFocus
                autoCapitalize="sentences"
                returnKeyType="next"
                errorText={errors.title}
                style={{ fontSize: 17, fontWeight: '600' }}
              />

              <LabeledInput
                label="Reiseziel (optional)"
                value={destination}
                onChangeText={setDestination}
                placeholder="z.B. Lissabon"
                autoCapitalize="words"
                returnKeyType="done"
              />

              <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                <View style={{ flex: 1 }}>
                  <DatePickerField
                    label="Von (optional)"
                    value={startDate}
                    onChange={setStartDate}
                    placeholder="Datum wählen"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <DatePickerField
                    label="Bis (optional)"
                    value={endDate}
                    onChange={setEndDate}
                    placeholder="Datum wählen"
                    minimumDate={startDate ? new Date(startDate) : undefined}
                  />
                </View>
              </View>
            </GlassCard>
          </ScrollView>

          {/* Fixed CTA */}
          <View
            style={{
              paddingHorizontal: spacing.md,
              paddingBottom: spacing.md,
              paddingTop: spacing.sm,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              backgroundColor: 'rgba(240,237,232,0.86)',
            }}
          >
            {submitError && (
              <Text style={{ ...typography.caption, color: '#EF4444', textAlign: 'center', marginBottom: spacing.sm }}>
                {submitError}
              </Text>
            )}
            <Pressable
              onPress={handleSubmit}
              style={({ pressed }) => ({
                backgroundColor: submitting ? colors.textMuted : colors.primary,
                paddingVertical: spacing.md,
                borderRadius: 14,
                alignItems: 'center',
                opacity: pressed ? 0.9 : 1,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.35,
                shadowRadius: 14,
                elevation: 4,
              })}
              disabled={submitting}
            >
              <Text style={{ ...typography.subheading, color: colors.white }}>
                {submitting ? 'Wird erstellt…' : 'Trip erstellen'}
              </Text>
            </Pressable>
          </View>
        </LiquidBackground>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
