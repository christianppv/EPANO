import { Pressable, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { Trip } from '../types/trip.types';
import { TripCard } from './trip-card';

type TripListProps = {
  trips: Trip[];
  onTripPress: (trip: Trip) => void;
  onCreatePress?: () => void;
};

export function TripList({ trips, onTripPress, onCreatePress }: TripListProps) {
  if (trips.length === 0) {
    return (
      <View style={{ alignItems: 'center', paddingVertical: spacing.xxl, paddingHorizontal: spacing.lg }}>
        <Text style={{ fontSize: 36, marginBottom: spacing.sm }}>🧳</Text>
        <Text style={{ ...typography.subheading, color: colors.text, marginBottom: spacing.xs }}>
          Erstelle deinen ersten Trip
        </Text>
        <Text style={{ ...typography.body, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.md }}>
          Starte mit einem Namen und teile danach euren Invite-Link mit der Gruppe.
        </Text>
        {onCreatePress ? (
          <Pressable
            onPress={onCreatePress}
            style={({ pressed }) => ({
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.sm + 2,
              borderRadius: 20,
              backgroundColor: colors.primary,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text style={{ ...typography.caption, fontWeight: '700', color: colors.white }}>
              Trip erstellen
            </Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  return (
    <View style={{ gap: spacing.sm + 4 }}>
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} onPress={() => onTripPress(trip)} />
      ))}
    </View>
  );
}
