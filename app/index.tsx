import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#fff',
      }}
    >
      <Text style={{ fontSize: 32, fontWeight: '700', marginBottom: 12 }}>EPANO</Text>
      <Text style={{ fontSize: 18, marginBottom: 24 }}>
        Plane Gruppenreisen ohne Chat-Chaos.
      </Text>

      <Link href="/trips" asChild>
        <Pressable
          style={{
            paddingVertical: 14,
            paddingHorizontal: 18,
            borderRadius: 12,
            backgroundColor: '#111',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            Zu meinen Reisen
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}