import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { colors } from '@/theme';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  pressed?: boolean;
};

const cardStyle: ViewStyle = {
  backgroundColor: colors.glass,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.7)',
  shadowColor: colors.black,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 2,
};

export function GlassCard({ children, style, onPress }: Props) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [cardStyle, { opacity: pressed ? 0.75 : 1 }, style]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[cardStyle, style]}>{children}</View>;
}
