import { Text, View } from 'react-native';
import { GlassCard } from '@/components/ui/glass-card';
import { colors, spacing, typography } from '@/theme';
import type { Option, OptionCategory } from '@/features/options/types/option.types';

const BOARD_CATEGORIES: OptionCategory[] = ['accommodation', 'flight', 'activity'];

const CATEGORY_CONFIG: Record<OptionCategory, { label: string; icon: string }> = {
  accommodation: { label: 'Unterkunft', icon: '🏠' },
  flight: { label: 'Flug', icon: '✈️' },
  activity: { label: 'Aktivität', icon: '🎯' },
  car: { label: 'Auto', icon: '🚗' },
  other: { label: 'Sonstiges', icon: '📎' },
};

type DecisionStatus = 'decided' | 'voting' | 'open';

function categoryStatus(options: Option[], category: OptionCategory): DecisionStatus {
  const inCategory = options.filter((o) => o.category === category);
  if (inCategory.length === 0) return 'open';
  if (inCategory.some((o) => o.status === 'decided')) return 'decided';
  return 'voting';
}

function statusStyle(status: DecisionStatus): { bg: string; textColor: string; label: string } {
  if (status === 'decided') {
    return { bg: 'rgba(26,158,143,0.14)', textColor: colors.statusConfirmed, label: '✓' };
  }
  if (status === 'voting') {
    return { bg: 'rgba(232,169,74,0.18)', textColor: colors.statusPlanning, label: '⟳ Vote' };
  }
  return { bg: 'rgba(0,0,0,0.05)', textColor: colors.textMuted, label: '—' };
}

type Props = {
  options: Option[];
};

export function DecisionBoardMini({ options }: Props) {
  return (
    <GlassCard
      style={{ marginHorizontal: spacing.md, padding: spacing.sm + 6, backgroundColor: colors.primaryGlass }}
    >
      <Text
        style={{ ...typography.caption, color: colors.primary, fontWeight: '700', marginBottom: spacing.sm }}
      >
        Decision Board
      </Text>
      <View style={{ flexDirection: 'row', gap: spacing.xs + 2 }}>
        {BOARD_CATEGORIES.map((cat) => {
          const config = CATEGORY_CONFIG[cat];
          const status = categoryStatus(options, cat);
          const style = statusStyle(status);
          return (
            <View
              key={cat}
              style={{
                flex: 1,
                borderRadius: 10,
                backgroundColor: style.bg,
                paddingVertical: spacing.xs + 2,
                paddingHorizontal: spacing.xs,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 17 }}>{config.icon}</Text>
              <Text style={{ ...typography.caption, color: colors.text, fontWeight: '500', marginTop: 1 }}>
                {config.label}
              </Text>
              <Text style={{ fontSize: 10, fontWeight: '700', color: style.textColor, marginTop: 2 }}>
                {style.label}
              </Text>
            </View>
          );
        })}
      </View>
    </GlassCard>
  );
}
