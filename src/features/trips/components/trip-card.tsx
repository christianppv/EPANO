import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { GlassCard } from '@/components/ui/glass-card';
import { AvatarStack } from '@/components/common/avatar-stack';
import { ProgressDots } from '@/components/common/progress-dots';
import { useTripMembers } from '../hooks/useTripMembers';
import { colors, spacing, typography } from '@/theme';
import { Trip, TripStatus } from '../types/trip.types';

const MONTHS_SHORT = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startDay = start.getDate();
  const endDay = end.getDate();
  const startMonth = MONTHS_SHORT[start.getMonth()];
  const endMonth = MONTHS_SHORT[end.getMonth()];
  const year = end.getFullYear();
  if (start.getMonth() === end.getMonth()) {
    return `${startDay}.–${endDay}. ${startMonth} ${year}`;
  }
  return `${startDay}. ${startMonth} – ${endDay}. ${endMonth} ${year}`;
}

const STATUS_LABEL: Record<TripStatus, string> = {
  planning: 'Planung',
  confirmed: 'Bestätigt',
  completed: 'Abgeschlossen',
};

const STATUS_COLOR: Record<TripStatus, string> = {
  planning: colors.statusPlanning,
  confirmed: colors.statusConfirmed,
  completed: colors.statusCompleted,
};

type TripCardProps = {
  trip: Trip;
  onPress: () => void;
};

export function TripCard({ trip, onPress }: TripCardProps) {
  const { members } = useTripMembers(trip.id);
  const memberNames = members.map((m) => m.name);

  return (
    <GlassCard onPress={onPress} style={{ overflow: 'hidden' }}>
      {/* Left accent stripe */}
      <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: trip.accentColor }} />

      <View style={{ paddingLeft: spacing.md + 4, paddingRight: spacing.md, paddingVertical: spacing.md }}>
        {/* Top row: destination + status badge */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Text style={{ ...typography.heading, color: colors.text, flex: 1, marginRight: spacing.sm }}>
            {trip.destination}
          </Text>
          <View style={{ backgroundColor: STATUS_COLOR[trip.status] + '20', paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: 20 }}>
            <Text style={{ ...typography.caption, fontWeight: '600', color: STATUS_COLOR[trip.status] }}>
              {STATUS_LABEL[trip.status]}
            </Text>
          </View>
        </View>

        {/* Trip title */}
        <Text style={{ ...typography.body, color: colors.textSecondary, marginTop: 2 }}>
          {trip.title}
        </Text>

        {/* Date row */}
        {trip.startDate && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.sm }}>
            <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
            <Text style={{ ...typography.caption, color: colors.textMuted }}>
              {formatDateRange(trip.startDate, trip.endDate)}
            </Text>
          </View>
        )}

        {/* Bottom row: progress dots + avatar stack */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm }}>
          <ProgressDots decided={0} voting={0} total={Math.min(trip.memberCount, 8)} />
          <AvatarStack names={memberNames} size={24} max={4} />
        </View>
      </View>
    </GlassCard>
  );
}
