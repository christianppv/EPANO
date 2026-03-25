import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
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
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: 14,
        overflow: 'hidden',
        opacity: pressed ? 0.75 : 1,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
      })}
    >
      {/* Left accent stripe */}
      <View
        style={{
          width: 4,
          backgroundColor: trip.accentColor,
        }}
      />

      {/* Card content */}
      <View style={{ flex: 1, padding: spacing.md }}>
        {/* Top row: destination + status badge */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Text style={{ ...typography.heading, color: colors.text, flex: 1, marginRight: spacing.sm }}>
            {trip.destination}
          </Text>
          <View
            style={{
              backgroundColor: STATUS_COLOR[trip.status] + '20',
              paddingHorizontal: spacing.sm,
              paddingVertical: 3,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                ...typography.caption,
                fontWeight: '600',
                color: STATUS_COLOR[trip.status],
              }}
            >
              {STATUS_LABEL[trip.status]}
            </Text>
          </View>
        </View>

        {/* Trip title */}
        <Text
          style={{
            ...typography.body,
            color: colors.textSecondary,
            marginTop: 2,
          }}
        >
          {trip.title}
        </Text>

        {/* Metadata row */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacing.sm,
            gap: spacing.md,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="calendar-outline" size={13} color={colors.textMuted} />
            <Text style={{ ...typography.caption, color: colors.textMuted }}>
              {formatDateRange(trip.startDate, trip.endDate)}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="people-outline" size={13} color={colors.textMuted} />
            <Text style={{ ...typography.caption, color: colors.textMuted }}>
              {trip.memberCount} Mitglieder
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
