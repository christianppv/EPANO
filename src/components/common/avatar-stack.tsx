import { Text, View } from 'react-native';
import { colors } from '@/theme';
import { Avatar } from './avatar';

type Props = {
  names: string[];
  max?: number;
  size?: number;
};

export function AvatarStack({ names, max = 4, size = 28 }: Props) {
  if (names.length === 0) return null;

  const visible = names.slice(0, max);
  const overflow = names.length - max;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {visible.map((name, i) => (
        <View key={i} style={{ marginLeft: i === 0 ? 0 : -8, zIndex: visible.length - i }}>
          <Avatar name={name} size={size} />
        </View>
      ))}
      {overflow > 0 && (
        <View
          style={{
            marginLeft: -8,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.backgroundCard,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1.5,
            borderColor: 'rgba(255,255,255,0.8)',
            zIndex: 0,
          }}
        >
          <Text style={{ fontSize: Math.round(size * 0.38), fontWeight: '600', color: colors.textSecondary }}>
            +{overflow}
          </Text>
        </View>
      )}
    </View>
  );
}
