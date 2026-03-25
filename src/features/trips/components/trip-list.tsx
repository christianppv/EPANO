import { Text, View } from 'react-native';
import { Trip } from '../types/trip.types';

type TripListProps = {
  trips: Trip[];
};

export function TripList({ trips }: TripListProps) {
  return (
    <View style={{ gap: 12 }}>
      {trips.map((trip) => (
        <View
          key={trip.id}
          style={{
            padding: 16,
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 12,
            backgroundColor: '#fff',
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '600' }}>{trip.title}</Text>
          <Text>{trip.destination}</Text>
          <Text>
            {trip.startDate} - {trip.endDate}
          </Text>
          <Text>{trip.memberCount} Mitglieder</Text>
        </View>
      ))}
    </View>
  );
}