import { Pressable, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';

type MemberCountStepperProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
};

export function MemberCountStepper({
  label,
  value,
  min = 1,
  max = 20,
  onChange,
}: MemberCountStepperProps) {
  function decrement() {
    if (value > min) onChange(value - 1);
  }
  function increment() {
    if (value < max) onChange(value + 1);
  }

  return (
    <View>
      <Text
        style={{
          ...typography.caption,
          fontWeight: '600',
          color: colors.textMuted,
          textTransform: 'uppercase',
          letterSpacing: 0.6,
          marginBottom: spacing.xs,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.white,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 10,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm + 2,
        }}
      >
        <Pressable
          onPress={decrement}
          style={({ pressed }) => ({
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: value <= min ? colors.backgroundCard : colors.backgroundCard,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: pressed ? 0.6 : value <= min ? 0.4 : 1,
          })}
          disabled={value <= min}
        >
          <Text style={{ fontSize: 18, fontWeight: '500', color: colors.text, lineHeight: 22 }}>
            −
          </Text>
        </Pressable>

        <Text
          style={{
            ...typography.subheading,
            color: colors.text,
            flex: 1,
            textAlign: 'center',
          }}
        >
          {value}
        </Text>

        <Pressable
          onPress={increment}
          style={({ pressed }) => ({
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.accentSoft,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: pressed ? 0.6 : value >= max ? 0.4 : 1,
          })}
          disabled={value >= max}
        >
          <Text style={{ fontSize: 18, fontWeight: '500', color: colors.accent, lineHeight: 22 }}>
            +
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
