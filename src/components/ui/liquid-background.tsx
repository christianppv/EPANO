import { View } from 'react-native';
import { colors } from '@/theme';

type LiquidBackgroundProps = {
  children: React.ReactNode;
};

export function LiquidBackground({ children }: LiquidBackgroundProps) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, overflow: 'hidden' }}>
      <View
        style={{
          position: 'absolute',
          top: -92,
          right: -72,
          width: 220,
          height: 220,
          borderRadius: 110,
          backgroundColor: 'rgba(26,158,143,0.08)',
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: -90,
          left: -56,
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: 'rgba(232,115,74,0.06)',
        }}
      />
      {children}
    </View>
  );
}
