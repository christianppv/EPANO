import { Pressable, Text } from 'react-native';

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
};

export function Pill({ label, active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        height: 32,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: active ? '#1A9E8F' : 'rgba(255,255,255,0.55)',
        borderWidth: active ? 0 : 1,
        borderColor: 'rgba(255,255,255,0.70)',
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Text
        style={{
          fontSize: 13,
          fontWeight: '500',
          lineHeight: 18,
          color: active ? '#FFFFFF' : '#6B6B6B',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
