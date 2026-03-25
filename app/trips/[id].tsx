import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Text>Trip Detail</Text>
      <Text>Trip ID: {id}</Text>
    </View>
  );
}