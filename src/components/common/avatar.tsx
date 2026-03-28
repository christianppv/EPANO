import { Text, View } from 'react-native';

const AVATAR_COLORS = [
  '#1A9E8F',
  '#E8734A',
  '#7B6FDE',
  '#E8A94A',
  '#DE6F8A',
  '#4A90D9',
];

function colorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

type Props = {
  name: string;
  size?: number;
  color?: string;
};

export function Avatar({ name, size = 28, color }: Props) {
  const bg = color ?? colorFromName(name);
  const initial = name.trim().charAt(0).toUpperCase();
  const fontSize = Math.round(size * 0.42);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.8)',
      }}
    >
      <Text style={{ fontSize, fontWeight: '600', color: '#FFFFFF', lineHeight: fontSize * 1.3 }}>
        {initial}
      </Text>
    </View>
  );
}
