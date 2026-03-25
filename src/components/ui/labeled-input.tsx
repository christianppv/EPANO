import { Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';

type LabeledInputProps = TextInputProps & {
  label: string;
  errorText?: string;
};

export function LabeledInput({ label, errorText, style, ...props }: LabeledInputProps) {
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
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[
          {
            ...typography.body,
            color: colors.text,
            backgroundColor: colors.white,
            borderWidth: 1,
            borderColor: errorText ? '#EF4444' : colors.border,
            borderRadius: 10,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm + 4,
          },
          style,
        ]}
        {...props}
      />
      {errorText ? (
        <Text style={{ ...typography.caption, color: '#EF4444', marginTop: spacing.xs }}>
          {errorText}
        </Text>
      ) : null}
    </View>
  );
}
