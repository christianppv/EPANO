import { Text, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { Trip } from '../types/trip.types';
import { TripCard } from './trip-card';

type TripListProps = {
  trips: Trip[];
  onTripPress: (trip: Trip) => void;
};

export function TripList({ trips, onTripPress }: TripListProps) {
  if (trips.length === 0) {
    return (
      <View style={{ alignItems: 'center', paddingVertical: spacing.xxl }}>
        <Text style={{ ...typography.subheading, color: colors.textSecondary, marginBottom: spacing.sm }}>
          Noch keine Reisen
        </Text>
        <Text style={{ ...typography.body, color: colors.textMuted, textAlign: 'center' }}>
          Tippe auf + um deine erste Reise zu erstellen.
        </Text>
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
