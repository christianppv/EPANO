import { useLocalSearchParams } from 'expo-router';
import { TripDashboard } from '@/features/trips/components/trip-dashboard';

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <TripDashboard tripId={id} />;
}
