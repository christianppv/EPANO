import { Pressable, Text, View } from 'react-native';
import { GlassCard } from '@/components/ui/glass-card';
import { colors, spacing, typography } from '@/theme';
import type { Option } from '../types/option.types';

const CATEGORY_ICON: Record<string, string> = {
  accommodation: '🏠',
  flight: '✈️',
  activity: '🎯',
  car: '🚗',
  other: '📎',
};

type Props = {
  option: Option;
  onReact?: (optionId: string, reaction: 'yes' | 'no') => void;
};

export function OptionCard({ option, onReact }: Props) {
  const decided = option.status === 'decided';
  const icon = CATEGORY_ICON[option.category] ?? '📎';

  return (
    <GlassCard
      style={{
        padding: spacing.md,
        borderWidth: decided ? 1.5 : 1,
        borderColor: decided ? 'rgba(26,158,143,0.35)' : 'rgba(255,255,255,0.7)',
      }}
    >
      {decided ? (
        <View
          style={{
            position: 'absolute',
            top: spacing.sm,
            right: spacing.sm,
            borderRadius: 8,
            backgroundColor: 'rgba(26,158,143,0.12)',
            paddingHorizontal: 8,
            paddingVertical: 2,
          }}
        >
          <Text style={{ fontSize: 10, fontWeight: '700', color: colors.primary }}>✓ DECIDED</Text>
        </View>
      ) : null}

      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 10,
            backgroundColor: colors.primaryGlass,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 28 }}>{icon}</Text>
        </View>

        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <View>
            <Text
              style={{ ...typography.subheading, color: colors.text, fontSize: 14 }}
              numberOfLines={2}
            >
              {option.title}
            </Text>
            {option.sourceDomain ? (
              <Text style={{ ...typography.caption, color: colors.textMuted, marginTop: 2 }}>
                {option.sourceDomain.toUpperCase()}
              </Text>
            ) : null}
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: spacing.sm,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {option.price ? (
                <Text style={{ ...typography.subheading, color: colors.primary, fontSize: 16 }}>
                  {option.price}
                </Text>
              ) : null}
              {option.rating ? (
                <Text style={{ ...typography.caption, color: colors.textMuted }}>★ {option.rating}</Text>
              ) : null}
            </View>

            {!decided ? (
              <View style={{ flexDirection: 'row', gap: spacing.xs }}>
                <Pressable
                  onPress={() => onReact?.(option.id, 'yes')}
                  style={({ pressed }) => ({
                    borderRadius: 8,
                    paddingVertical: 4,
                    paddingHorizontal: 10,
                    backgroundColor: 'rgba(26,158,143,0.12)',
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <Text style={{ ...typography.caption, color: colors.primary, fontWeight: '600' }}>👍</Text>
                </Pressable>
                <Pressable
                  onPress={() => onReact?.(option.id, 'no')}
                  style={({ pressed }) => ({
                    borderRadius: 8,
                    paddingVertical: 4,
                    paddingHorizontal: 10,
                    backgroundColor: 'rgba(232,92,74,0.12)',
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <Text style={{ ...typography.caption, color: '#E85C4A', fontWeight: '600' }}>👎</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </GlassCard>
  );
}
