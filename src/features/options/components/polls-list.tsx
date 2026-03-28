import { ScrollView, Text, View } from 'react-native';
import { GlassCard } from '@/components/ui/glass-card';
import { colors, spacing, typography } from '@/theme';
import type { Poll } from '../hooks/usePolls';

const MONTHS_SHORT = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

function formatDeadline(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()}. ${MONTHS_SHORT[d.getMonth()]} · ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} Uhr`;
}

type Props = {
  polls: Poll[];
  isLoading?: boolean;
  memberCount: number;
};

export function PollsList({ polls, isLoading, memberCount }: Props) {
  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ ...typography.body, color: colors.textMuted }}>Laden…</Text>
      </View>
    );
  }

  if (polls.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl }}>
        <Text style={{ fontSize: 36, marginBottom: spacing.sm }}>🗳️</Text>
        <Text style={{ ...typography.subheading, color: colors.textSecondary, textAlign: 'center' }}>
          Noch keine Abstimmung
        </Text>
        <Text
          style={{
            ...typography.caption,
            color: colors.textMuted,
            marginTop: spacing.xs,
            textAlign: 'center',
          }}
        >
          Erstelle eine Abstimmung aus einer Option, um die Gruppe zur Entscheidung zu bringen.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ gap: spacing.md }}>
        {polls.map((poll) => {
          const isOpen = poll.status === 'open';
          const topScore = Math.max(...poll.results.map((r) => r.yes), 1);
          const totalVotes = poll.results.reduce((sum, r) => sum + r.yes + r.no + r.maybe, 0);

          return (
            <GlassCard key={poll.id} style={{ padding: spacing.md }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: spacing.sm,
                }}
              >
                <Text style={{ ...typography.subheading, color: colors.text, flex: 1 }} numberOfLines={1}>
                  {poll.title}
                </Text>
                {isOpen ? (
                  <View
                    style={{
                      borderRadius: 8,
                      backgroundColor: 'rgba(232,169,74,0.18)',
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      marginLeft: spacing.sm,
                    }}
                  >
                    {poll.deadline ? (
                      <Text style={{ fontSize: 10, fontWeight: '700', color: colors.statusPlanning }}>
                        ⏳ bis {formatDeadline(poll.deadline)}
                      </Text>
                    ) : (
                      <Text style={{ fontSize: 10, fontWeight: '700', color: colors.statusPlanning }}>
                        ⟳ Offen
                      </Text>
                    )}
                  </View>
                ) : (
                  <View
                    style={{
                      borderRadius: 8,
                      backgroundColor: 'rgba(26,158,143,0.12)',
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      marginLeft: spacing.sm,
                    }}
                  >
                    <Text style={{ fontSize: 10, fontWeight: '700', color: colors.primary }}>
                      ✓ Abgeschlossen
                    </Text>
                  </View>
                )}
              </View>

              <Text style={{ ...typography.caption, color: colors.textMuted, marginBottom: spacing.sm }}>
                {poll.totalVoters} von {memberCount} {memberCount === 1 ? 'Person' : 'Personen'}{' '}
                {poll.totalVoters === 1 ? 'hat' : 'haben'} abgestimmt
              </Text>

              {poll.results.length > 0 ? (
                <View style={{ gap: spacing.sm }}>
                  {poll.results.map((result) => {
                    const barWidth = Math.max(8, Math.round((result.yes / topScore) * 100));
                    return (
                      <View key={result.pollOptionId}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 4,
                          }}
                        >
                          <Text
                            style={{ ...typography.caption, color: colors.textSecondary, flex: 1 }}
                            numberOfLines={1}
                          >
                            {result.optionTitle}
                          </Text>
                          <Text style={{ ...typography.caption, color: colors.textMuted }}>
                            {result.yes}👍 {result.no}👎
                          </Text>
                        </View>
                        <View
                          style={{
                            height: 6,
                            borderRadius: 999,
                            backgroundColor: 'rgba(0,0,0,0.06)',
                            overflow: 'hidden',
                          }}
                        >
                          <View
                            style={{
                              width: `${barWidth}%`,
                              height: 6,
                              borderRadius: 999,
                              backgroundColor:
                                result.yes === topScore && result.yes > 0
                                  ? colors.primary
                                  : colors.statusCompleted,
                            }}
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : null}

              {totalVotes === 0 ? (
                <Text
                  style={{
                    ...typography.caption,
                    color: colors.textMuted,
                    marginTop: spacing.sm,
                    textAlign: 'center',
                  }}
                >
                  Noch keine Stimmen
                </Text>
              ) : null}
            </GlassCard>
          );
        })}
      </View>
    </ScrollView>
  );
}
