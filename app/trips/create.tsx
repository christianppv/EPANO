import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LabeledInput } from '@/components/ui/labeled-input';
import { MemberCountStepper } from '@/components/ui/member-count-stepper';
import { useCreateTrip } from '@/features/trips/hooks/useCreateTrip';
import { parseGermanDate } from '@/features/trips/utils/parse-date-input';
import { colors, spacing, typography } from '@/theme';

type FormErrors = {
  destination?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
};

export default function CreateTripScreen() {
  const { createTrip } = useCreateTrip();

  const [destination, setDestination] = useState('');
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [memberCount, setMemberCount] = useState(2);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function validate(): boolean {
    const next: FormErrors = {};

    if (!destination.trim()) {
      next.destination = 'Bitte gib ein Reiseziel ein.';
    }
    if (!title.trim()) {
      next.title = 'Bitte gib einen Reisenamen ein.';
    }
    if (startDate.trim() && !parseGermanDate(startDate)) {
      next.startDate = 'Format: TT.MM.JJJJ';
    }
    if (endDate.trim() && !parseGermanDate(endDate)) {
      next.endDate = 'Format: TT.MM.JJJJ';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const trip = await createTrip({ destination, title, startDate: startDate || undefined, endDate: endDate || undefined, memberCount });
      router.replace(`/trips/${trip.id}`);
    } catch {
      setSubmitError('Reise konnte nicht erstellt werden. Bitte erneut versuchen.');
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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
          <Text style={{ ...typography.heading, color: colors.text }}>Neue Reise</Text>
        </View>

        {/* Form */}
        <ScrollView
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Trip identity — the emotional core */}
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: 16,
              padding: spacing.md,
              gap: spacing.md,
              shadowColor: colors.black,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 1,
              marginBottom: spacing.md,
            }}
          >
            <LabeledInput
              label="Wohin geht's?"
              value={destination}
              onChangeText={(v) => {
                setDestination(v);
                if (errors.destination) setErrors((e) => ({ ...e, destination: undefined }));
              }}
              placeholder="z.B. Barcelona"
              autoFocus
              autoCapitalize="words"
              returnKeyType="next"
              errorText={errors.destination}
              style={{ fontSize: 20, fontWeight: '600' }}
            />
            <LabeledInput
              label="Wie heißt eure Reise?"
              value={title}
              onChangeText={(v) => {
                setTitle(v);
                if (errors.title) setErrors((e) => ({ ...e, title: undefined }));
              }}
              placeholder="z.B. Sommertrip mit Freunden"
              autoCapitalize="sentences"
              returnKeyType="done"
              errorText={errors.title}
            />
          </View>

          {/* Trip details — dates and group size */}
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: 16,
              padding: spacing.md,
              gap: spacing.md,
              shadowColor: colors.black,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 1,
            }}
          >
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <View style={{ flex: 1 }}>
                <LabeledInput
                  label="Von (optional)"
                  value={startDate}
                  onChangeText={(v) => {
                    setStartDate(v);
                    if (errors.startDate) setErrors((e) => ({ ...e, startDate: undefined }));
                  }}
                  placeholder="01.07.2026"
                  keyboardType="numbers-and-punctuation"
                  returnKeyType="next"
                  errorText={errors.startDate}
                />
              </View>
              <View style={{ flex: 1 }}>
                <LabeledInput
                  label="Bis (optional)"
                  value={endDate}
                  onChangeText={(v) => {
                    setEndDate(v);
                    if (errors.endDate) setErrors((e) => ({ ...e, endDate: undefined }));
                  }}
                  placeholder="07.07.2026"
                  keyboardType="numbers-and-punctuation"
                  returnKeyType="done"
                  errorText={errors.endDate}
                />
              </View>
            </View>

            <MemberCountStepper
              label="Wie viele Personen?"
              value={memberCount}
              min={1}
              max={20}
              onChange={setMemberCount}
            />
          </View>
        </ScrollView>

        {/* Fixed CTA */}
        <View
          style={{
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.lg,
            paddingTop: spacing.sm,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            backgroundColor: colors.background,
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
              backgroundColor: submitting ? colors.textSecondary : colors.text,
              paddingVertical: spacing.md,
              borderRadius: 14,
              alignItems: 'center',
              opacity: pressed ? 0.85 : 1,
            })}
            disabled={submitting}
          >
            <Text style={{ ...typography.subheading, color: colors.white }}>
              {submitting ? 'Wird erstellt…' : 'Reise erstellen'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
