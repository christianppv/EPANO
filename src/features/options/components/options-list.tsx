import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { OptionCard } from './option-card';
import type { Option, OptionCategory } from '../types/option.types';

type FilterId = 'all' | OptionCategory;

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'Alle' },
  { id: 'accommodation', label: '🏠 Unterkunft' },
  { id: 'flight', label: '✈️ Flug' },
  { id: 'activity', label: '🎯 Aktivität' },
];

type Props = {
  options: Option[];
  isLoading?: boolean;
  onReact?: (optionId: string, reaction: 'yes' | 'no') => void;
};

export function OptionsList({ options, isLoading, onReact }: Props) {
  const [filter, setFilter] = useState<FilterId>('all');

  const filtered = useMemo(
    () => (filter === 'all' ? options : options.filter((o) => o.category === filter)),
    [options, filter],
  );

  return (
    <ScrollView
      contentContainerStyle={{ paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing.sm, paddingRight: spacing.md }}
      >
        {FILTERS.map((pill) => (
          <Pressable
            key={pill.id}
            onPress={() => setFilter(pill.id)}
            style={({ pressed }) => ({
              height: 32,
              borderRadius: 20,
              paddingHorizontal: 14,
              justifyContent: 'center',
              borderWidth: filter === pill.id ? 0 : 1,
              borderColor: colors.border,
              backgroundColor: filter === pill.id ? colors.primary : colors.glass,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text
              style={{
                ...typography.caption,
                fontWeight: '500',
                color: filter === pill.id ? colors.white : colors.textSecondary,
              }}
            >
              {pill.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={{ gap: spacing.sm + 2, marginTop: spacing.md }}>
        {isLoading ? (
          <View style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
            <Text style={{ ...typography.body, color: colors.textMuted }}>Laden…</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
            <Text style={{ fontSize: 32, marginBottom: spacing.sm }}>🔗</Text>
            <Text style={{ ...typography.subheading, color: colors.textSecondary }}>Noch keine Optionen</Text>
            <Text
              style={{
                ...typography.caption,
                color: colors.textMuted,
                marginTop: spacing.xs,
                textAlign: 'center',
              }}
            >
              Füge einen Link hinzu, um die erste Option zu erstellen.
            </Text>
          </View>
        ) : (
          filtered.map((option) => (
            <OptionCard key={option.id} option={option} onReact={onReact} />
          ))
        )}
      </View>
    </ScrollView>
  );
}
