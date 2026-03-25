import { TripList } from '@/features/trips/components/trip-list';
import { useTrips } from '@/features/trips/hooks/useTrips';
import { ScrollView, Text, View } from 'react-native';

export default function TripsScreen() {
  const { trips, isLoading, error } = useTrips();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Lade Reisen...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Fehler beim Laden der Reisen.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 20 }}>Meine Reisen</Text>
      <TripList trips={trips} />
    </ScrollView>
  );
}