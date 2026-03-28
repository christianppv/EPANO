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
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.06,
  shadowRadius: 24,
  elevation: 3,
};

export function GlassCard({ children, style, onPress }: Props) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          {
            opacity: pressed ? 0.94 : 1,
            transform: [{ scale: pressed ? 0.985 : 1 }],
            shadowOpacity: pressed ? 0.03 : 0.06,
            elevation: pressed ? 2 : 3,
          },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[cardStyle, style]}>{children}</View>;
}
