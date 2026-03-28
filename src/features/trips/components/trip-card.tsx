import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { GlassCard } from '@/components/ui/glass-card';
import { AvatarStack } from '@/components/common/avatar-stack';
import { ProgressDots } from '@/components/common/progress-dots';
import { useTripMembers } from '../hooks/useTripMembers';
import { colors, spacing, typography } from '@/theme';
import { Trip } from '../types/trip.types';

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

type Progress = {
  decided: number;
  voting: number;
};

function progressFromTrip(trip: Trip): Progress {
  const total = Math.max(trip.memberCount, 1);
  if (trip.status === 'completed') {
    return { decided: total, voting: 0 };
  }
  if (trip.status === 'confirmed') {
    const decided = Math.max(1, Math.min(total - 1, Math.ceil(total * 0.5)));
    return { decided, voting: total > decided ? 1 : 0 };
  }
  return { decided: 0, voting: Math.min(total, 1) };
}

type TripCardProps = {
  trip: Trip;
  onPress: () => void;
};

export function TripCard({ trip, onPress }: TripCardProps) {
  const { members } = useTripMembers(trip.id);
  const memberNames = members.map((m) => m.name);
  const progress = progressFromTrip(trip);

  return (
    <GlassCard onPress={onPress} style={{ padding: spacing.md }}>
      {/* Left accent stripe */}
      <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: trip.accentColor }} />

      <View style={{ paddingLeft: spacing.sm }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.sm }}>
          <View style={{ flex: 1 }}>
            <Text style={{ ...typography.subheading, color: colors.text, fontSize: 17, lineHeight: 24 }} numberOfLines={1}>
              {trip.title}
            </Text>
            <Text style={{ ...typography.caption, color: colors.textMuted, marginTop: 2 }} numberOfLines={1}>
              {trip.destination}
            </Text>
          </View>
          <AvatarStack names={memberNames} size={26} max={4} />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm }}>
          {trip.startDate && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
              <Text style={{ ...typography.caption, color: colors.textMuted }}>
                {formatDateRange(trip.startDate, trip.endDate)}
              </Text>
            </View>
          )}
          <Text style={{ ...typography.caption, color: colors.textMuted }}>
            · {trip.memberCount} Personen
          </Text>
        </View>

        <View style={{ marginTop: spacing.sm + 2 }}>
          <ProgressDots decided={progress.decided} voting={progress.voting} total={Math.min(Math.max(trip.memberCount, 1), 8)} showLabel />
        </View>
      </View>
    </GlassCard>
  );
}
